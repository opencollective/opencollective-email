import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withIntl from '../lib/withIntl';
import Metadata from '../components/PostItem/Metadata';
import Reply from '../components/Reply/ReplyItem';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import { Content } from '../styles/layout';
import { PostBody } from '../styles/Post';
import TitleWithActions from '../components/TitleWithActions';
import env from '../env.frontend';

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
    if (!post) {
      return <div>Loading</div>;
    }
    const followEmail = `${post.group.slug}/${post.PostId}/follow@${env.DOMAIN}?subject=${encodeURIComponent(
      `Follow ${post.title}`,
    )}&body=${encodeURIComponent('Just send this email to start following this thread')}`;
    const replyEmail = `${post.group.slug}/${post.PostId}@${env.DOMAIN}?subject=${encodeURIComponent(
      `Re: ${post.title}`,
    )}&body=${encodeURIComponent('Enter your reply here.\n(please remove this text and your email signature if any)')}`;
    const actions = [
      { label: 'follow', mailto: followEmail, style: 'standard' },
      { label: 'reply', mailto: replyEmail },
    ];
    return (
      <div>
        <TopBar group={post.group} />
        <Content>
          <TitleWithActions title={post.title} actions={actions} />
          <Metadata user={post.user.name} createdAt={post.createdAt} followers={post.followers} />
          <PostBody dangerouslySetInnerHTML={{ __html: post.html }} />
          {post.replies.nodes.map((post, i) => (
            <Reply post={post} key={i} />
          ))}
        </Content>
        <Footer group={post.group} post={post} />
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
        slug
      }
      user {
        id
        name
      }
      followers {
        total
        nodes {
          ... on User {
            name
            image
          }
        }
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
