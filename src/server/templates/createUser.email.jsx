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

export const subject = () => {
  return `Please confirm`;
};

export const body = ({ confirmationUrl }) => {
  return (
    <Layout>
      <p>
        Thank you for contacting the Citizen Spring Collective. Since this is your very first email to an open
        collective, we want to make sure that you understand that your email will be made public so that anyone in the
        collective, present or future, can access it.
      </p>
      <p>
        To continue, click on the button below. If you'd like to remain anonymous, we recommend that you send your email
        from a different email address.
      </p>
      <a style={styles.btn} href={confirmationUrl}>
        create my account and publish my email
      </a>
    </Layout>
  );
};
