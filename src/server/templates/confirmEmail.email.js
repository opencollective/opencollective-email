import config from 'config';
import React from 'react';
import Oy from 'oy-vey';
import Layout from './email.layout';
import { get } from 'lodash';

const styles = {
  btn: {
    display: 'block',
    maxWidth: '240px',
    borderRadius: '16px',
    backgroundColor: '#3399FF',
    color: 'white',
    textDecoration: 'none',
    padding: '5px 10px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disclaimer: {
    color: '#555',
    fontSize: '12px',
  },
};

export const subject = () => {
  return `Action required: your email is pending`;
};

export const previewText = ({ groupSlug }) => {
  return `Please confirm sending your email to ${groupSlug}@${get(config, 'server.domain')}`;
};

export const body = ({ groupSlug, confirmationUrl, post }) => {
  const groupUrl = `${get(config, 'collective.website')}/${groupSlug}`;
  return (
    <Layout>
      <p>Thank you for contacting the {groupSlug} group.</p>
      <p>
        Since this is the first time you are sending an email to this address, we ask you to kindly confirm that you are
        a human ☺️ We also want to make sure that you understand that all emails sent this email address are published
        publicly on <a href={groupUrl}>{groupUrl}</a>.
      </p>
      <p>To continue, click on the button below.</p>
      <center>
        <a style={styles.btn} href={confirmationUrl}>
          post my email
          <br />
          to the {groupSlug} group
        </a>
      </center>
      <p style={styles.disclaimer}>
        Note: If you'd like to use another identity, we recommend that you send your email from a different email
        address.
      </p>
      <hr />
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </Layout>
  );
};
