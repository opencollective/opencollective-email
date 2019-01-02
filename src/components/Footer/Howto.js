import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import { HowtoWrapper } from './Styles';
import HowtoItem from './HowtoItem';
import env from '../../env.frontend';

export default function Howto({ groupSlug, PostId }) {
  const threadEmail = `${groupSlug}/${PostId}@${env.DOMAIN}`;
  const groupEmail = `${groupSlug}@${env.DOMAIN}`;
  return (
    <HowtoWrapper>
      {PostId && (
        <HowtoItem icon="↵">
          Reply to this thread by sending an email to <Link mailto={threadEmail}>{threadEmail}</Link>
        </HowtoItem>
      )}
      <HowtoItem icon="✉️">
        Start a new thread by sending an email to <Link mailto={groupEmail}>{groupEmail}</Link>
      </HowtoItem>
      <HowtoItem icon="oc">Start a new group by sending an email to :newgroup@{env.DOMAIN}</HowtoItem>
    </HowtoWrapper>
  );
}

Howto.propTypes = {
  groupSlug: PropTypes.string.isRequired,
  PostId: PropTypes.number,
};
