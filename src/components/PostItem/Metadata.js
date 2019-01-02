import React from 'react';
import PropTypes from '../../lib/propTypes';
import Moment from 'react-moment';

import { MetadataWrapper, FooterLink } from './Styles';

export default function Metadata({ repliesCount, followersCount, createdAt, user }) {
  const timestamp = new Date(Number(createdAt));
  return (
    <MetadataWrapper>
      <span>
        Started <Moment fromNow>{timestamp}</Moment> by
      </span>
      <span>
        <FooterLink>{user}</FooterLink>
      </span>
      {repliesCount > 0 && <span> | {repliesCount} replies</span>}
      {followersCount > 0 && <span> | {followersCount} followers</span>}
    </MetadataWrapper>
  );
}

Metadata.propTypes = {
  user: PropTypes.string.isRequired,
  repliesCount: PropTypes.number,
  followersCount: PropTypes.number,
  createdAt: PropTypes.string.isRequired,
};
