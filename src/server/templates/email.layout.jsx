import config from 'config';
import React from 'react';
import Oy from 'oy-vey';
import { get } from 'lodash';

const { Table, TBody, TR, TD } = Oy;

export default ({ preview, children, maxWidth }) => {
  return (
    <Table width={maxWidth}>
      <TBody>
        <TR>
          <TD>
            <span
              style={{
                display: 'none !important',
                color: '#FFFFFF',
                margin: 0,
                padding: 0,
                fontSize: '1px',
                lineHeight: '1px',
              }}
            >
              {preview}
            </span>
            {children}
          </TD>
        </TR>
        <TR>
          <TD>{get(config, 'collective.name')} - Open Collective</TD>
        </TR>
      </TBody>
    </Table>
  );
};
