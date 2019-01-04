import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ListItemWrapper } from './Styles';
import Title from './Title';
import Metadata from './Metadata';

class PostListItem extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
    groupSlug: PropTypes.string.isRequired,
    repliesCount: PropTypes.number,
    followersCount: PropTypes.number,
  };

  render() {
    const { groupSlug, post, followersCount, repliesCount } = this.props;
    const path = `/${groupSlug}/${post.slug}`;
    return (
      <ListItemWrapper>
        <Title title={post.title} path={path} createdAt={post.createdAt} />
        <Metadata
          user={post.user.name}
          createdAt={post.createdAt}
          followersCount={followersCount}
          repliesCount={repliesCount}
        />
      </ListItemWrapper>
    );
  }
}

export default PostListItem;
