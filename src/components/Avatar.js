import React from 'react';
import PropTypes from '../lib/propTypes';

export default function Avatar({ user, height }) {
  const image = user.image || `https://ui-avatars.com/api/?rounded=true&name=${user.name}`;
  return <img src={image} height={height || 36} />;
}

Avatar.propTypes = {
  user: PropTypes.nodeType('User').isRequired,
};
