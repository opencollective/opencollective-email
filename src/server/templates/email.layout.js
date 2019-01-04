import config from 'config';
import React from 'react';
import Oy from 'oy-vey';
import { get } from 'lodash';

const { Table, TBody, TR, TD } = Oy;

const styles = {
  body: {
    fontFamily: 'Helvetica Neue',
    lineHeight: 1.3,
  },
  footer: {
    fontFamily: 'Helvetica Neue',
    fontSize: '12px',
    textAlign: 'center',
    paddingTop: '3rem',
  },
};

export default ({ children, maxWidth }) => {
  return (
    <Table width={maxWidth}>
      <TBody>
        <TR>
          <TD style={styles.body}>{children}</TD>
        </TR>
        <TR>
          <TD style={styles.footer}>{get(config, 'collective.name')} - Open Collective</TD>
        </TR>
      </TBody>
    </Table>
  );
};
