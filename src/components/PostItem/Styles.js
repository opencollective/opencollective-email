import styled from 'styled-components';

export const ListItemWrapper = styled.div`
  margin: 8px 0;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 10pt;
`;

export const DateContainer = styled.div`
  margin: 0px 5px;
  color: #828282;
`;

export const Title = styled.h1`
  color: #000000;
  font-size: 1.6rem;
  text-decoration: none;
  margin: 0px 0px;
  &:visited {
    color: #828282;
  }
`;

export const MetadataWrapper = styled.div`
  font-size: 1.2rem;
  display: 'flex';
  color: #828282;
  margin: 0;
`;

export const FooterLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener',
})`
  color: #828282;
  text-decoration: none;
  margin: 0px 3px;
`;
