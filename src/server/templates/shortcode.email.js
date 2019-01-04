import config from 'config';
import { get } from 'lodash';
import React from 'react';
import Oy from 'oy-vey';

import Layout from './email.layout';

export const subject = ({ shortcode }) => {
  return `Signing in to ${get(config, 'collective.name')}`;
};

export const body = ({ shortcode }) => {
  return (
    <Layout preview={`Your short code is ${shortcode}`}>
      <div>
        Your short code is
        <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{shortcode}</div>
      </div>
    </Layout>
  );
};
