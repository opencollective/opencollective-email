import React from 'react';
import { get } from 'lodash';
import config from 'config';
import Layout from './email.layout';
import { pluralize } from '../lib/utils';

export const subject = ({ groupSlug, followersCount }) => {
  return `Message sent to ${groupSlug} (${followersCount} ${pluralize('follower', followersCount)})`;
};

export const text = ({ groupSlug, followersCount, post }) => {
  const groupEmail = `${groupSlug}@${get(config, 'server.domain')}`;
  const groupUrl = `${get(config, 'server.baseUrl')}/${groupSlug}`;
  let msg = `Your message has been sent to the ${groupSlug} group.
You can view it online on ${groupUrl}/${post.slug}\n`;
  if (followersCount === 1) {
    msg += `\nYou are the only person following this group at the moment.
Other people can follow this group online on ${groupUrl} or by sending an empty email to ${groupEmail}.`;
  } else if (followersCount > 1) {
    msg += `\n${followersCount} people are currently following this group. They have been notified.`;
  }
  return msg;
};

export const body = ({ groupSlug, followersCount, post }) => {
  const groupEmail = `${groupSlug}@${get(config, 'server.domain')}`;
  const groupUrl = `${get(config, 'server.baseUrl')}/${groupSlug}`;
  const postUrl = `${get(config, 'server.baseUrl')}/${groupSlug}/${post.slug}`;
  return (
    <Layout>
      <p>
        Your message has been sent to the {groupSlug} group.{' '}
        {followersCount > 1 && <span>(currently followed by {followersCount} people)</span>}.
      </p>
      {followersCount === 1 && (
        <p>
          You are the only person following this group at the moment.
          <br />
          Other people can follow this group online on {groupUrl} or by sending an empty email to {groupEmail}.
        </p>
      )}
      <p>
        You can view it online on <a href={postUrl}>{postUrl}</a>.
      </p>
    </Layout>
  );
};
