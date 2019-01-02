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
    confirmationUrl: `${config.server.baseUrl}/api/publishEmail?groupSlug=${groupSlug}&token=${token}`,
  };
  if (isEmpty(email['stripped-text'])) {
    return await libemail.sendTemplate('confirmJoinGroup', data, email.sender);
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

  const { groupSlug, ParentPostId, PostId, action } = parseEmailAddress(req.body.recipient);
  const groupEmail = `${groupSlug}@${get(config, 'server.domain')}`.toLowerCase();

  // Ignore emails coming from ourselves (since we send emails to the group and cc recipients)
  const defaultEmailFrom = extractEmailsFromString(get(config, 'email.from'))[0];
  if (req.body.sender === groupEmail || req.body.sender === defaultEmailFrom) {
    console.info('Receiving email sent from the group to the group, discarding');
    return res.send('ok');
  }

  if (action === 'follow') {
    const group = await models.Group.findBySlug(groupSlug);
    if (!group) {
      console.error(`Group ${groupSlug} not found`);
      return res.send(200);
    }
    if (PostId) {
      // Follow thread
      const post = await models.Post.findById(PostId);
      if (!post) {
        console.error(`Post ${PostId} not found`);
        return res.send(200);
      }
      const postUrl = await post.getUrl();
      const data = {
        groupSlug,
        postUrl,
        post,
        unsubscribe: { label: 'Unfollow this thread', data: { PostId } },
      };
      await libemail.sendTemplate('followThread', data, email.sender);
      return send('ok');
    } else {
      // Follow group
      const data = {
        groupSlug,
        unsubscribe: { label: 'Unfollow this group', data: { GroupId: group.GroupId } },
      };
      await libemail.sendTemplate('followGroup', data, email.sender);
      return send('ok');
    }
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
  return res.send('ok');
}
