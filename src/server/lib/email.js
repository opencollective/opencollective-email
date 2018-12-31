import React from 'react';
import Oy from 'oy-vey';
import debugLib from 'debug';
const debug = debugLib('email');
import { get, uniq } from 'lodash';
import nodemailer from 'nodemailer';
import config from 'config';
import { parseEmailAddress, extractNamesAndEmailsFromString } from '../lib/utils';
import { createJwt } from '../lib/auth';
import path from 'path';
import fs from 'fs';

import * as shortcode from '../templates/shortcode.email.js';
import * as confirmEmail from '../templates/confirmEmail.email.js';
import * as joinGroup from '../templates/joinGroup.email.js';
import * as groupCreated from '../templates/groupCreated.email.js';
import * as groupInfo from '../templates/groupInfo.email.js';
import * as threadCreated from '../templates/threadCreated.email.js';
import * as post from '../templates/post.email.js';
import models from '../models';

const templates = {
  shortcode,
  confirmEmail,
  joinGroup,
  threadCreated,
  post,
  groupCreated,
  groupInfo,
};

const libemail = {};

console.log(`> Using mailgun account ${get(config, 'email.mailgun.user')}`);

const generateCustomTemplate = (options, data) => {
  let unsubscribeSnippet = '',
    previewText = '';
  if (data.unsubscribe) {
    unsubscribeSnippet = `
      <div class="footer" style="margin-top: 2rem; font-size: 10px;">
        <a href="${data.unsubscribe.url}">
          ${data.unsubscribe.label}
        </a>
      </div>`;
  }
  if (options.previewText) {
    previewText = `<span style="display:none;color:#FFFFFF;margin:0;padding:0;font-size:1px;line-height:1px;">
      ${options.previewText}
    </span>`;
  }
  return `
    <!doctype html>
    <html>
      <head>
        <title>${options.title}</title>
      </head>
      <body>
      ${previewText}
      ${options.bodyContent}
      ${unsubscribeSnippet}
      </body>
    </html>
  `;
};

libemail.generateUnsubscribeUrl = async function(email, where) {
  const user = await models.User.findByEmail(email);
  if (!user) {
    console.warn(`Cannot generate unsubscribe url for ${email}: user not found`);
    return null;
  }
  where.role = 'FOLLOWER';
  where.UserId = user.id;
  const members = await models.Member.findAll();
  const member = await models.Member.findOne({ where });
  if (!member) {
    console.warn('libemail.generateUnsubscribeUrl: no membership found for', where);
    return;
  }
  const tokenData = {
    MemberId: member.id,
  };
  const token = createJwt('unfollow', tokenData, '7d');
  return `${config.collective.website}/api/unfollow?token=${token}`;
};

libemail.parseHeaders = function(email) {
  if (!email.sender) {
    throw new Error('libemail.parseHeaders: invalid email object');
  }
  const sender = email.sender.toLowerCase();
  const recipient = email.recipient || email.recipients; // mailgun's inconsistent api
  const { groupSlug, tags, ParentPostId, PostId } = parseEmailAddress(recipient);
  const recipients = extractNamesAndEmailsFromString(`${email.To}, ${email.Cc}`).filter(r => {
    return r.email && r.email.toLowerCase() !== sender && r.email.toLowerCase() !== recipient.toLowerCase();
  });
  return { sender, groupSlug, tags, recipients, ParentPostId, PostId };
};

/**
 * Generate template with data and send html email to recipients
 * @pre: recipients: array(email)
 */
libemail.sendTemplate = async function(template, data, to, options = {}) {
  if (!templates[template]) {
    throw new Error(`Template ${template} not found`);
  }
  if ((options.exclude || []).includes(to)) {
    throw new Error(`Recipient is in the exclude list (${to})`);
  }
  const cc = uniq((options.cc || []).map(r => r.trim().toLowerCase())).filter(email => {
    if (options.exclude && options.exclude.includes(email)) {
      console.info(`Excluding ${email}`);
      return false;
    }

    // If for some reason the sender sends an email to the group and cc the group as well,
    // we ignore this user error
    if (email.substr(email.indexOf('@') + 1) === get(config, 'collective.domain')) {
      const { groupSlug } = parseEmailAddress(email);
      if (to.substr(0, to.indexOf('@')) === groupSlug) {
        console.info(`Skipping ${email}`);
        return false;
      }
    }
    return true;
  });
  const subject = templates[template].subject(data);
  debug('Sending', template, 'email to', to, 'cc', cc, subject);
  if (process.env.DEBUG && process.env.DEBUG.match(/data/)) {
    debug('with data', data);
  }

  const templateComponent = React.createElement(templates[template].body, data);

  const prepareEmailForRecipient = async function(recipientEmailAddr) {
    // we generate a unique unsubscribe url per recipient
    if (get(data, 'unsubscribe.data')) {
      data.unsubscribe.url = await libemail.generateUnsubscribeUrl(recipientEmailAddr, data.unsubscribe.data);
    }
    const previewText = templates[template].previewText && templates[template].previewText(data);
    const text = templates[template].text && templates[template].text(data);
    const html = Oy.renderTemplate(templateComponent, { title: subject, previewText }, opts =>
      generateCustomTemplate(opts, data),
    );
    return { text, html };
  };

  const sendEmailWithIndividualUnsubscribeUrl = async function(to, cc, email) {
    const { text, html } = await prepareEmailForRecipient(email);
    const emailOpts = {
      ...options,
      template,
      cc,
    };
    return libemail.send(to, subject, text, html, emailOpts);
  };

  // note: the goal here is to send an email to the group email and sending in cc to each recipient
  // with each their own unsubscribe one click link despite the fact that we are sending to the group email
  if (cc.length > 0) {
    return await Promise.all(
      cc.map(async ccEmail => await sendEmailWithIndividualUnsubscribeUrl(to, ccEmail, ccEmail)),
    );
  } else {
    return await sendEmailWithIndividualUnsubscribeUrl(to, null, to);
  }
};

libemail.send = async function(to, subject, text, html, options = {}) {
  if (!to || !to.match(/[^@]+@.+\..+/)) {
    console.warning(`libemail.send: invalid to email address: ${to}, skipping`);
    return;
  }
  if (options.exclude && options.exclude.includes(to)) {
    console.info(`libemail.send: excluding ${to}`);
    return;
  }
  let transport;
  if (process.env.MAILDEV) {
    transport = {
      ignoreTLS: true,
      port: 1025,
    };
  } else if (get(config, 'email.mailgun.password')) {
    transport = {
      service: 'Mailgun',
      auth: {
        user: get(config, 'email.mailgun.user'),
        pass: get(config, 'email.mailgun.password'),
      },
    };
  }

  if (process.env.DEBUG && process.env.DEBUG.match(/email/)) {
    const recipientSlug = to.substr(0, to.indexOf('@'));
    const filepath = path.resolve(`/tmp/${options.template}.${recipientSlug}.html`);
    fs.writeFileSync(filepath, html);
    debug('preview:', filepath);
  }
  if (!transport) {
    console.warn('lib/email: please configure mailgun or run a local test mail server (see README).');
    return;
  }

  const mailgun = nodemailer.createTransport(transport);

  const from = options.from || config.email.from;
  const cc = options.cc;
  const bcc = options.bcc;
  const attachments = options.attachments;

  // only attach tag in production to keep data clean
  const tag = config.env === 'production' ? options.tag : 'internal';
  const headers = { 'X-Mailgun-Tag': tag, 'X-Mailgun-Dkim': 'yes', ...options.headers };
  debug('send from:', from, 'to:', to, 'cc:', cc, JSON.stringify(headers));
  return await mailgun.sendMail({
    from,
    cc,
    to,
    bcc,
    subject,
    text,
    html,
    headers,
    attachments,
  });
};

export default libemail;
