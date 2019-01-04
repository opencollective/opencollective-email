import styled from 'styled-components';

export const GroupBoxWrapper = styled.div`
  border-radius: 0.8rem;
  width: 25rem;
  padding: 1.6rem;
  border: 1px solid rgb(220, 222, 224);
  background-color: ${props => props.color || 'rgb(247, 248, 250)'};
  &:hover {
    border: 1px solid black;
  }
`;

export const Name = styled.h2`
  color: black;
`;

export const Metadata = styled.div`
  font-size: 1.2rem;
  color: #555;
`;

export const GroupEmail = styled.div`
  margin-top: -1rem;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;
