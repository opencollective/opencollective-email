import React from 'react';
import PropTypes from 'prop-types';
import { Icon, HowtoItemWrapper } from './Styles';

export default function Howto({ icon, children }) {
  const iconNode = icon === 'oc' ? <img src="/static/images/opencollectiveicon-48x48@2x.png" height={16} /> : icon;

  return (
    <HowtoItemWrapper>
      <Icon>{iconNode}</Icon>
      <div>{children}</div>
    </HowtoItemWrapper>
  );
}

Howto.propTypes = {
  icon: PropTypes.string,
};
