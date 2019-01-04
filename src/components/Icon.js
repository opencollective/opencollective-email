import React from 'react';
import PropTypes from 'prop-types';

export default function Header({ height }) {
  return <img src="/static/images/opencollectiveicon-48x48@2x.png" height={height || 24} />;
}

Header.propTypes = {
  height: PropTypes.number,
};
