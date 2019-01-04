import React from 'react';
import Layout from './email.layout';

export const subject = ({ post: { title } }) => {
  return title;
};

export const text = ({ subscribe, unsubscribe, post: { text } }) => {
  const subscribeTxt = subscribe ? `${subscribe.label}\n${subscribe.url}\n` : '';

  return `${text}


---
${subscribeTxt}
${unsubscribe.label}\n${unsubscribe.url}`;
};

export const body = ({ post: { html } }) => {
  return (
    <Layout>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Layout>
  );
};
