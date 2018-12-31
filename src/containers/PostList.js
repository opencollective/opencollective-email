import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import Spinner from 'react-spinkit';

import PostListItem from '../components/Post/ListItem';

const Wrapper = styled.div`
  margin: 0px;
`;
const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
`;

export default class PostList extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired,
  };
  render() {
    const { posts } = this.props;

    if (posts.length > 0) {
      return this.renderList(posts);
    } else
      return (
        <LoadingWrapper>
          loading
          {/* <Spinner name="ball-grid-pulse" fadeIn="none" /> */}
        </LoadingWrapper>
      );
  }

  renderList(posts) {
    return (
      <Wrapper>
        {posts.map((item, i) => (
          <PostListItem key={item.id} post={item} groupSlug={this.props.groupSlug} />
        ))}
      </Wrapper>
    );
  }
}
