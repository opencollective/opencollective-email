import React from 'react';
import PropTypes from 'prop-types';
import Link from '../Link';
import { Title } from './Styles';

export default function PostItemTitle(props) {
  return (
    <Title>
      <Link href={props.path} color="black">
        {props.title}
      </Link>
    </Title>
  );
}

PostItemTitle.propTypes = {
  title: PropTypes.string.isRequired,
};
