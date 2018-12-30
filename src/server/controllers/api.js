import config from 'config';
import { verifyJwt } from '../lib/auth';
import { get } from 'lodash';
import request from 'request-promise';
import { extractNamesAndEmailsFromString } from '../lib/utils';
import models from '../models';
import { db } from '../lib/test';

export const retrieveEmail = async ({ mailServer, messageId }) => {
  const requestOptions = {
    json: true,
    auth: {
      user: 'api',
      pass: get(config, 'email.mailgun.apiKey'),
    },
  };
  const url = `https://${mailServer}.api.mailgun.net/v3/domains/${get(
    config,
    'collective.domain',
  )}/messages/${messageId}`;
  return await request.get(url, requestOptions);
};

/**
 * Publish an email to the group that is stored on the mail server
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export async function publishEmail(req, res, next) {
  const { groupSlug } = req.query;
  let token;
  try {
    token = verifyJwt(req.query.token);
  } catch (e) {
    if (e && e.name === 'TokenExpiredError') {
      throw new Error(
        `The token has expired. Please resend your email to ${groupSlug}@${get(config, 'collective.domain')}`,
      );
    }
  }
  let email;
  try {
    email = await retrieveEmail(token);
  } catch (e) {
    if (e.statusCode === 404) {
      return res.status(404).send('Email not found');
    } else {
      console.error('>>> retrieveEmail error', token, 'response:', JSON.stringify(e));
      return res.send('Unknown error');
    }
  }
  const post = await models.Post.createFromEmail(email);
  let redirect = `/${groupSlug}`;
  if (post) {
    redirect += `/${post.id}`;
  }
  return res.redirect(redirect);
}

export async function unfollow(req, res, next) {
  let token;
  try {
    token = verifyJwt(req.query.token);
  } catch (e) {
    if (e && e.name === 'TokenExpiredError') {
      throw new Error(
        `The token has expired. Please resend your email to ${groupSlug}@${get(config, 'collective.domain')}`,
      );
    }
  }
  const member = await models.Member.findById(token.MemberId);
  let msg;
  if (!member) {
    console.error(`api.unfollow: can't find Member.id`, token.MemberId);
    return res.send(`It looks like you've already unsubscribed from those notifications`);
  }
  if (member.PostId) {
    msg = `You have successfully unsubscribed from future updates to this thread`;
  } else {
    msg = `You have successfully unsubscribed from new messages sent to this group`;
  }
  await member.destroy();
  return res.send(msg);
}

export async function reset(req, res) {
  if (!req.query.secret || req.query.secret !== process.env.SECRET) {
    return res.send('invalid secret');
  }
  await db.reset();
  return res.send('db reset');
}
