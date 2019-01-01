import libemail from '../lib/email';
import { parseEmailAddress, extractEmailsFromString, isEmpty } from '../lib/utils';
import { createJwt } from '../lib/auth';
import models from '../models';
import config from 'config';
import { get } from 'lodash';
import debugLib from 'debug';
const debug = debugLib('webhook');

async function handleFirstTimeUser(groupSlug, email) {
  if (!email['message-url']) {
    throw new Error('Invalid webhook payload: missing "message-url"');
  }

  const messageId = email['message-url'].substr(email['message-url'].lastIndexOf('/') + 1);
  const mailServer = email['message-url'].substring(8, email['message-url'].indexOf('.'));

  const tokenData = { messageId, mailServer };
  const token = createJwt('emailConfirmation', tokenData, '1h');
  const data = {
    groupSlug,
    confirmationUrl: `${config.collective.website}/api/publishEmail?groupSlug=${groupSlug}&token=${token}`,
  };
  if (isEmpty(email['stripped-text'])) {
    return await libemail.sendTemplate('joinGroup', data, email.sender);
  } else {
    data.post = { html: email['stripped-html'] };
    return await libemail.sendTemplate('confirmEmail', data, email.sender);
  }
}

export default async function webhook(req, res, next) {
  if (!req.body.recipient) {
    throw new Error('Invalid webhook payload: missing "recipient"');
  }
  debug('receiving email from:', req.body.sender, 'to:', req.body.recipient, 'subject:', req.body.subject);

  // Ignore emails coming from ourselves (since we send emails to the group and cc recipients)
  const { groupSlug } = parseEmailAddress(req.body.recipient);
  const groupEmail = `${groupSlug}@${get(config, 'server.domain')}`.toLowerCase();
  const defaultEmailFrom = extractEmailsFromString(get(config, 'email.from'))[0];
  if (req.body.sender === groupEmail || req.body.sender === defaultEmailFrom) {
    console.info('Receiving email sent from the group to the group, discarding');
    return res.send('ok');
  }

  // Look if sender already has an account
  const user = await models.User.findByEmail(req.body.sender);

  // If no, we send a confirmation email before creating / publishing an account
  // the user will have to click the link provided in an email confirmation to publish their email to the group
  if (!user) {
    debug('user not found');
    await handleFirstTimeUser(groupSlug, req.body);
    return res.send('ok');
  }

  await models.Post.createFromEmail(req.body);
  console.log('>>> sending ok');
  return res.send('ok');
}
