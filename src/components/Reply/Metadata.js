import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { MetadataWrapper, FooterLink } from './Styles';

export default function Footer(props) {
  const timestamp = new Date(Number(props.createdAt));
  return (
    <MetadataWrapper>
      {props.user} replied <Moment fromNow>{timestamp}</Moment>
    </MetadataWrapper>
  );
}

Footer.propTypes = {
  user: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};
