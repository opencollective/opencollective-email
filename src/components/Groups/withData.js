import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import withIntl from '../../lib/withIntl';
import GroupList from '../../containers/GroupList';

class GroupsWithData extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const groups = this.props.data.allGroups;
    if (!groups) return <div>Loading</div>;

    return (
      <div>
        <GroupList groups={groups} />
      </div>
    );
  }
}

const getDataQuery = gql`
  query allGroups {
    allGroups {
      total
      nodes {
        id
        ... on Group {
          name
          color
          slug
          followers {
            total
          }
          posts {
            total
            nodes {
              ... on Post {
                replies {
                  total
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GROUPS_PER_PAGE = 20;

export const addData = graphql(getDataQuery, {
  options(props) {
    return {
      variables: {
        groupSlug: props.groupSlug,
        offset: 0,
        limit: props.limit || GROUPS_PER_PAGE * 2,
      },
    };
  },
  props: ({ data }) => ({
    data,
    fetchMore: () => {
      return data.fetchMore({
        variables: {
          offset: data.allGroups.nodes.length,
          limit: GROUPS_PER_PAGE,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          previousResult.allGroups.nodes = [...previousResult.allGroups.nodes, fetchMoreResult.allGroups.nodes];
          console.log('>>> updateQuery previousResult', previousResult, 'fetchMoreResult', fetchMoreResult);
          return previousResult;
        },
      });
    },
  }),
});

export default withIntl(addData(GroupsWithData));
