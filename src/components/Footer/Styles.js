import styled from 'styled-components';
import settings from '../../../settings.json';

export const FooterWrapper = styled.div`
  margin-top: 3rem;
  background: url(${settings.background}) no-repeat top center;
  background-size: cover;
  height: 350px;
  padding: 2rem;
`;

export const FooterTitle = styled.h1`
  color: white;
  font-size: 2.8rem;
  margin-bottom: 0;
`;
export const FooterSubtitle = styled.h2`
  margin-top: 0;
  color: #222;
  font-size: 1.8rem;
`;

export const FooterLink = styled.a.attrs({
  target: '_blank',
  rel: 'noopener',
})`
  color: #828282;
  text-decoration: none;
  margin: 0px 3px;
`;

export const HowtoWrapper = styled.div``;

export const HowtoItemWrapper = styled.div`
  display: flex;
  margin: 0.2rem 0;
`;

export const Icon = styled.div`
  width: 20px;
  margin-right: 2px;
`;
