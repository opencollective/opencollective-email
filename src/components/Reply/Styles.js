import styled from 'styled-components';

export const ReplyWrapper = styled.div`
  background-color: white;
  display: flex;
  margin: 3rem 0 1rem 0;
`;

export const ContentWrapper = styled.div`
  margin-left: 1rem;
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

export const MetadataWrapper = styled.div`
  padding: 0px;
  font-size: 1.2rem;
  line-height: 36px;
  color: #828282;
  margin: 0 0 1rem 0;
`;

export const FooterLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener',
})`
  color: #828282;
  text-decoration: none;
  margin: 0px 3px;
`;
