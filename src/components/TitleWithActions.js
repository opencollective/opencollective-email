import React from 'react';
import PropTypes from '../lib/propTypes';
import StyledLink from './StyledLink';
import styled from 'styled-components';
import Link from './Link';
const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin-right: 1rem;
`;

const Actions = styled.div`
  display: flex;
`;
const Action = styled.div`
  margin: 0.5rem;
`;

export default function TitleWithActions({ title, actions }) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Actions>
        {actions.map((action, i) => (
          <Action key={i}>
            <Link mailto={action.mailto}>
              <StyledLink buttonStyle={action.style || 'primary'} buttonSize="small">
                {action.label}
              </StyledLink>
            </Link>
          </Action>
        ))}
      </Actions>
    </Wrapper>
  );
}
