import React from 'react';
import Router from '../server/pages';
import PropTypes from '../lib/propTypes';
import styled from 'styled-components';
import colors from '../constants/colors';

const StyledA = styled.a`
  color: ${props => props.color || colors.blue};
  text-decoration: none;
  cursor: pointer;
`;

export default function Link({ href, mailto, color, children }) {
  if (mailto) {
    return (
      <StyledA color={color} href={`mailto:${mailto}`}>
        {children}
      </StyledA>
    );
  }
  return (
    <Router.Link route={href}>
      <StyledA color={color}>{children}</StyledA>
    </Router.Link>
  );
}

Link.propTypes = {
  href: PropTypes.string,
  mailto: PropTypes.email,
};
