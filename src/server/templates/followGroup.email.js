import config from 'config';
import React from 'react';
import Layout from './email.layout';
import { get } from 'lodash';

export const subject = ({ groupSlug }) => {
  return `You are now following ${groupSlug}@${get(config, 'server.domain')}`;
};

export const previewText = ({ groupSlug }) => {
  return `You will now receive all new emails sent to the ${groupSlug}@${get(config, 'server.domain')} mailing list`;
};

export const body = ({ groupSlug }) => {
  const groupUrl = `${get(config, 'server.baseUrl')}/${groupSlug}`;
  return (
    <Layout>
      <p>
        You are now following the <a href={`${get(config, 'server.baseUrl')}/${groupSlug}`}>{groupSlug}</a> group of the
        ${get(config, 'collective.name')} collective. All new emails sent to ${groupSlug}@$
        {get(config, 'server.domain')} will now also be sent to you.
      </p>
      <p>
        Please note that in order to preserve your inbox, you will only receive replies to threads that you have replied
        to or that you have explicitly asked to follow (there is a follow link at the bottom of every new email sent to
        the group).
      </p>
      <p>If this is an error, click on the link below to unfollow this mailing list.</p>
    </Layout>
  );
};
