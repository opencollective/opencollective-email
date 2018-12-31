import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

import { FooterWrapper, FooterLink } from './Styles';

export default function Footer(props) {
  const timestamp = new Date(Number(props.createdAt));
  return (
    <FooterWrapper>
      <Moment fromNow>{timestamp}</Moment> by
      <FooterLink>{props.user}</FooterLink>
    </FooterWrapper>
  );
}

Footer.propTypes = {
  user: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};
