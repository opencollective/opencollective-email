import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './Styles';
import Metadata from './Metadata';

class Reply extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const { groupSlug, post } = this.props;
    const path = `/${groupSlug}/${post.slug}`;
    return (
      <Wrapper>
        <Metadata user={post.user.name} createdAt={post.createdAt} />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </Wrapper>
    );
  }
}

export default Reply;
