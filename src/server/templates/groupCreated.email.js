import config from 'config';
import React from 'react';
import Layout from './email.layout';
import { get } from 'lodash';

export const subject = () => {
  return `New group email created`;
};

export const previewText = ({ group, followers }) => {
  return `${group.slug}@${get(config, 'server.domain')} currently has ${followers.length} followers`;
};

export const text = ({ group, followers }) => {
  const groupEmail = `${group.slug}@${get(config, 'server.domain')}`;
  return `Welcome to your new email group ${groupEmail}.
${followers.length > 1 ? `\nFollowers:\n${followers.map(follower => `- ${follower.name}\n`)}` : ''}

You can view it online on ${get(config, 'server.baseUrl')}/${
    group.slug
  }. You can also easily manage it right from your email client:

# How to add people?

Anyone can start following this group by sending an empty email to ${groupEmail}. Alternatively, you can also reply to this email and cc the people that you want to add to the group.

# How to remove people?

Any time you receive an email, there is a link in the footer to unsubscribe (either from new emails sent to the group or from new emails in a given thread).

# How to know how many people are following the group?

Anyone can send an empty email to the group ${groupEmail} to receive the latest info about the group and a summary of the latest threads.
`;
};

export const body = ({ group, followers }) => {
  const groupEmail = `${group.slug}@${get(config, 'server.domain')}`;
  return (
    <Layout>
      <p>Welcome to your new email group {groupEmail}.</p>
      {followers.length > 1 && (
        <div>
          <h3>Followers</h3>
          <ul>
            {followers.map((follower, i) => (
              <li key={i}>{follower.name}</li>
            ))}
          </ul>
        </div>
      )}
      <p>
        You can view it online on {get(config, 'server.baseUrl')}/{group.slug}. You can also easily manage it right from
        your email client:
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
      <h3>How to know how many people are following the group?</h3>
      <p>
        Anyone can send an empty email to the group {groupEmail} to receive the latest info about the group and a
        summary of the latest threads.
      </p>
    </Layout>
  );
};
