import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withIntl from '../lib/withIntl';
import PostList from './PostList';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

import { Content } from '../styles/layout';
import TitleWithActions from '../components/TitleWithActions';

import env from '../env.frontend';

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
    const groupEmail = `${group.slug}@${env.DOMAIN}`;
    const actions = [{ label: '+ New Thread', mailto: groupEmail }];

    return (
      <div>
        <TopBar group={group} />
        <Content>
          <TitleWithActions title={group.name} actions={actions} />
          <PostList groupSlug={group.slug} posts={group.posts.nodes} />
        </Content>
        <Footer group={group} />
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
            followers {
              total
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
