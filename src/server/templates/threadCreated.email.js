import React from 'react';
import Oy from 'oy-vey';

const { Table, TBody, TR, TD } = Oy;
import Layout from './email.layout';

const styles = {
  btn: {
    display: 'block',
    height: '16px',
    borderRadius: '16px',
    backgroundColor: '#3399FF',
    color: 'white',
    padding: '5px 10px',
    fontSize: '22px',
    fontWeight: 'bold',
  },
};

export const subject = ({ groupSlug, followersCount }) => {
  return `Message sent to ${groupSlug} (${followersCount} followers)`;
};

export const body = ({ groupSlug, followersCount }) => {
  return (
    <Layout>
      <p>
        Your message has been sent to the group {groupSlug}.<br />
        {followersCount} people are currently following this group.
      </p>
    </Layout>
  );
};
