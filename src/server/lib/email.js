import React from 'react';
import Oy from 'oy-vey';
import debugLib from 'debug';
const debug = debugLib('email');
import { get, uniq } from 'lodash';
import nodemailer from 'nodemailer';
import config from 'config';
import { extractInboxAndTagsFromEmailAddress, extractNamesAndEmailsFromString } from '../lib/utils';
import { createJwt } from '../lib/auth';
import path from 'path';
import fs from 'fs';

import * as ShortCode from '../templates/shortcode.email.js';
import * as CreateUser from '../templates/createUser.email.js';
import * as ThreadCreated from '../templates/threadCreated.email.js';
import * as Post from '../templates/post.email.js';
import models from '../models';

const templates = {
  shortcode: ShortCode,
  createUser: CreateUser,
  threadCreated: ThreadCreated,
  post: Post,
};

const libemail = {};

console.log(`> Using mailgun account ${get(config, 'email.mailgun.user')}`);

const generateCustomTemplate = (options, data) => {
  let unsubscribeSnippet = '';
  if (data.unsubscribe) {
    unsubscribeSnippet = `
      <div class="footer" style="margin-top: 2rem; font-size: 10px;">
        <a href="${data.unsubscribe.url}">
          ${data.unsubscribe.label}
        </a>
      </div>`;
  }
  return `
    <!doctype html>
    <html>
      <head>
        <title>${options.title}</title>
      </head>
      <body>
        ${options.bodyContent}
        ${unsubscribeSnippet}
      </body>
    </html>
  `;
};

libemail.generateUnsubscribeUrl = async function(email, where) {
  const user = await models.User.findByEmail(email);
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
  const { inbox, tags } = extractInboxAndTagsFromEmailAddress(recipient);
  const recipients = extractNamesAndEmailsFromString(`${email.To}, ${email.Cc}`).filter(r => {
    return r.email.toLowerCase() !== sender && r.email.toLowerCase() !== recipient.toLowerCase();
  });
  return { sender, groupSlug: inbox, tags, recipients };
};

/**
 * Generate template with data and send html email to recipients
 * @pre: recipients: array(email)
 */
libemail.sendTemplate = async function(template, data, recipients, options = {}) {
  if (!templates[template]) {
    throw new Error(`Template ${template} not found`);
  }
  let uniqueRecipients = uniq(recipients.map(r => r.trim().toLowerCase()));
  if (options.exclude) {
    uniqueRecipients = uniqueRecipients.filter(email => !options.exclude.includes(email));
  }
  const subject = templates[template].subject(data);
  debug(
    'Sending email to',
    uniqueRecipients,
    subject,
    'using template',
    template,
    'with data',
    data.dataValues ? data.dataValues : data,
  );
  const templateComponent = React.createElement(templates[template].body, data);

  const sendEmail = async function(emailAddr) {
    // we generate a unique unsubscribe url per recipient
    if (get(data, 'unsubscribe.data')) {
      data.unsubscribe.url = await libemail.generateUnsubscribeUrl(emailAddr, data.unsubscribe.data);
    }
    const previewText = templates[template].previewText && templates[template].previewText(data);
    const text = templates[template].text && templates[template].text(data);
    const html = Oy.renderTemplate(templateComponent, { title: subject, previewText }, opts =>
      generateCustomTemplate(opts, data),
    );
    options.template = template;
    return libemail.send(emailAddr, subject, text, html, options);
  };

  return await Promise.all(uniqueRecipients.map(sendEmail));
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
    debug('preview: ', filepath);
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
