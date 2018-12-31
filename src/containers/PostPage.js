import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FormattedMessage, defineMessages } from 'react-intl';
import { get } from 'lodash';
import withIntl from '../lib/withIntl';
import PostList from './PostList';
import getConfig from 'next/config';
import Metadata from '../components/Post/Metadata';
import Reply from '../components/Reply/ReplyItem';
const { publicRuntimeConfig } = getConfig();

class PostPage extends React.Component {
  static propTypes = {
    postSlug: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const post = this.props.data.Post;
    const replyToEmail = `${post.slug}/posts/${post.PostId}@${publicRuntimeConfig.COLLECTIVE_DOMAIN}`;
    return (
      <div>
        <h1>{post.group.name}</h1>
        <h2>{post.title}</h2>
        <Metadata user={post.user.name} createdAt={post.createdAt} />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
        {post.replies.nodes.map(post => (
          <Reply post={post} />
        ))}
        <p>
          To reply to this thread, just send an email to <a href={`mailto:${replyToEmail}`}>{replyToEmail}</a>
        </p>
      </div>
    );
  }
}

const getDataQuery = gql`
  query Post($postSlug: String) {
    Post(postSlug: $postSlug) {
      PostId
      slug
      title
      html
      createdAt
      group {
        id
        name
      }
      user {
        id
        name
      }
      replies {
        total
        nodes {
          ... on Post {
            id
            PostId
            html
            createdAt
            user {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const POSTS_PER_PAGE = 20;

export const addData = graphql(getDataQuery, {
  options(props) {
    return {
      variables: {
        postSlug: props.postSlug,
        offset: 0,
        limit: props.limit || POSTS_PER_PAGE * 2,
      },
    };
  },
  props: ({ data }) => ({
    data,
    fetchMore: () => {
      return data.fetchMore({
        variables: {
          offset: data.Post.posts.nodes.length,
          limit: POSTS_PER_PAGE,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          previousResult.Post.posts.nodes = [...previousResult.Post.posts.nodes, fetchMoreResult.Post.posts.nodes];
          console.log('>>> updateQuery previousResult', previousResult, 'fetchMoreResult', fetchMoreResult);
          return previousResult;
        },
      });
    },
  }),
});

export default withIntl(addData(PostPage));
