import config from 'config';
import React from 'react';
import Oy from 'oy-vey';
import Layout from './email.layout';
import { get } from 'lodash';
import settings from '../../../settings.json';

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

export const subject = ({ groupSlug }) => {
  return `Action required: please confirm to join the ${groupSlug} group`;
};

export const previewText = ({ groupSlug }) => {
  return `You are one click away from joining the ${groupSlug}@${get(config, 'server.domain')} mailing list`;
};

export const body = ({ groupSlug, confirmationUrl }) => {
  const groupUrl = `${get(config, 'collective.website')}/${groupSlug}`;
  return (
    <Layout>
      <p>
        Before you join, please make sure that you read the <a href={settings.code_of_conduct}>Code Of Conduct</a>. All
        emails sent to this group are published on <a href={groupUrl}>{groupUrl}</a>.
      </p>
      <p>To continue, click on the button below.</p>
      <center>
        <a style={styles.btn} href={confirmationUrl}>
          Join the {groupSlug} group
        </a>
      </center>
      <p style={styles.disclaimer}>
        Note: If you'd like to use another identity, we recommend that you send your email from a different email
        address.
      </p>
    </Layout>
  );
};
