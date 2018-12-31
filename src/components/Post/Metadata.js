import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { FooterWrapper, FooterLink } from './Styles';

export default function Metadata(props) {
  const timestamp = new Date(Number(props.createdAt));
  return (
    <FooterWrapper>
      Started <Moment fromNow>{timestamp}</Moment> by
      <FooterLink>{props.user}</FooterLink>
      {props.repliesCount && <div>| {props.repliesCount} replies</div>}
    </FooterWrapper>
  );
}

Metadata.propTypes = {
  user: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};