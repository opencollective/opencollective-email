import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Wrapper } from './Styles';
import Header from './Header';
import Metadata from './Metadata';

class PostListItem extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const { groupSlug, post } = this.props;
    const path = `/${groupSlug}/${post.slug}`;
    return (
      <Wrapper>
        <Header title={post.title} path={path} createdAt={post.createdAt} />
        <Metadata user={post.user.name} createdAt={post.createdAt} repliesCount={post.replies.total} />
      </Wrapper>
    );
  }
}

export default PostListItem;
