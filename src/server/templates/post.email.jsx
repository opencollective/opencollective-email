import React from 'react';
import Oy from 'oy-vey';

const { Table, TBody, TR, TD } = Oy;
import Layout from './email.layout';

export const subject = ({ post: { title } }) => {
  return title;
};

export const text = ({ unsubscribe, post: { text } }) => `${text}\n\n---\n${unsubscribe.label}\n${unsubscribe.url}`;

export const body = ({ post: { html } }) => {
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
};
