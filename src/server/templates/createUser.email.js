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
  return `Please confirm sending your email to ${groupSlug}@${get(config, 'collective.domain')}`;
};

export const body = ({ groupSlug, confirmationUrl }) => {
  return (
    <Layout>
      <p>
        Thank you for contacting the{' '}
        <a href={get(config, 'collective.website')}>{get(config, 'collective.name')} Collective</a>. Since this is your
        very first email to an open collective, we want to make sure that you understand that your email will be made
        public so that anyone in the collective, present or future, can access it.
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
        Note: If you'd like to remain anonymous, we recommend that you send your email from a different email address.
      </p>
    </Layout>
  );
};
