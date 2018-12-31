import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../server/pages';
import { HeaderWrapper, DateContainer, Title } from './Styles';

export default function Header(props) {
  return (
    <HeaderWrapper>
      <Link route={props.path}>
        <Title>{props.title}</Title>
      </Link>
    </HeaderWrapper>
  );
}

Header.propTypes = {
  createdAt: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};
