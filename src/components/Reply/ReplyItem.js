import React, { Component } from 'react';
import PropTypes from '../../lib/propTypes';

import { ReplyWrapper, ContentWrapper } from './Styles';
import Avatar from '../Avatar';
import Metadata from './Metadata';

class Reply extends Component {
  static propTypes = {
    post: PropTypes.nodeType('Post').isRequired,
  };

  render() {
    const { groupSlug, post } = this.props;
    return (
      <ReplyWrapper>
        <Avatar user={post.user} />
        <ContentWrapper>
          <Metadata user={post.user.name} createdAt={post.createdAt} />
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </ContentWrapper>
      </ReplyWrapper>
    );
  }
}

export default Reply;
