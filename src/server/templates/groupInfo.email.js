import config from 'config';
import React from 'react';
import Layout from './email.layout';
import { get } from 'lodash';

export const subject = ({ group }) => {
  return `${group.slug} group info`;
};

export const previewText = ({ group, followers }) => {
  return `${group.slug}@${get(config, 'collective.domain')} currently has ${followers.length} followers`;
};

export const body = ({ group, followers }) => {
  const groupEmail = `${group.slug}@${get(config, 'collective.domain')}`;
  return (
    <Layout>
      <p>This is the latest data about the {group.slug} group.</p>
      <ul>
        {followers.map(follower => (
          <li>{follower.name}</li>
        ))}
      </ul>
      <p>
        You can manage it online on {get(config, 'collective.website')}/{group.slug} (coming soon). You can also easily
        manage it right from your email client:
      </p>
      <h3>How to add people?</h3>
      <p>
        Anyone can start following this group by sending an empty email to {groupEmail}. Alternatively, you can also
        reply to this email and cc the people that you want to add to the group.
      </p>
      <h3>How to remove people?</h3>
      <p>
        Any time you receive an email, there is a link in the footer to unsubscribe (either from new emails sent to the
        group or from new emails in a given thread).
      </p>
    </Layout>
  );
};
