import config from 'config';
import React from 'react';
import Layout from './email.layout';
import { get } from 'lodash';

export const subject = ({ post }) => {
  return `You are now following ${post.title}`;
};

export const previewText = ({ post }) => {
  return `You will now receive all new replies to ${post.title}`;
};

export const body = ({ groupSlug, post, postUrl }) => {
  const groupUrl = `${get(config, 'server.baseUrl')}/${groupSlug}`;
  return (
    <Layout>
      <p>
        You are now following the <a href={postUrl}>{post.title}</a> thread. All new replies sent to ${groupSlug}/$
        {post.PostId}@${get(config, 'server.domain')} will now also be sent to you.
      </p>
      <p>If this is an error, click on the link below to unfollow this thread.</p>
    </Layout>
  );
};
