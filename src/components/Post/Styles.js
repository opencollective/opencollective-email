import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: white;
  padding: 8px;
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

export const Title = styled.a`
  color: #000000;
  text-decoration: none;
  margin: 0px 0px;
  &:visited {
    color: #828282;
  }
`;

export const FooterWrapper = styled.div`
  padding: 4px 0px 0px 0px;
  font-size: 7pt;
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
