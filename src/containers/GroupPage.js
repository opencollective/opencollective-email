import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { FormattedMessage, defineMessages } from 'react-intl';
import { get } from 'lodash';
import withIntl from '../lib/withIntl';
import PostList from './PostList';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

class GroupPage extends React.Component {
  static propTypes = {
    groupSlug: PropTypes.string.isRequired,
    intl: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const group = this.props.data.Group;
    if (!group) return <div>Loading</div>;
    const groupEmail = `${group.slug}@${publicRuntimeConfig.COLLECTIVE_DOMAIN}`;
    return (
      <div>
        <h1>{group.name}</h1>
        <p>
          To start a new thread, just send an email to <a href={`mailto:${groupEmail}`}>{groupEmail}</a>
        </p>
        <PostList groupSlug={group.slug} posts={group.posts.nodes} />
      </div>
    );
  }
}

const getDataQuery = gql`
  query Group($groupSlug: String!) {
    Group(groupSlug: $groupSlug) {
      id
      slug
      name
      posts {
        total
        nodes {
          id
          ... on Post {
            PostId
            title
            slug
            createdAt
            user {
              id
              name
            }
            replies {
              total
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
        groupSlug: props.groupSlug,
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
          offset: data.Group.posts.nodes.length,
          limit: POSTS_PER_PAGE,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          previousResult.Group.posts.nodes = [...previousResult.Group.posts.nodes, fetchMoreResult.Group.posts.nodes];
          console.log('>>> updateQuery previousResult', previousResult, 'fetchMoreResult', fetchMoreResult);
          return previousResult;
        },
      });
    },
  }),
});

export default withIntl(addData(GroupPage));
