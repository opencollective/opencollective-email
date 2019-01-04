import React, { Component } from 'react';
import PropTypes from '../lib/propTypes';
import styled from 'styled-components';
// import Spinner from 'react-spinkit';
import GroupBox from '../components/Groups/GroupBox';
import Link from '../components/Link';

const ListWrapper = styled.div`
  margin-left: -1rem;
  display: flex;
`;

const GroupBoxWrapper = styled.div`
  margin: 1rem;
`;

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 50px;
`;

export default class PostList extends Component {
  static propTypes = {
    groups: PropTypes.nodeList.isRequired,
  };

  render() {
    const { groups } = this.props;

    if (groups.total > 0) {
      return this.renderList(groups);
    } else
      return (
        <LoadingWrapper>
          loading
          {/* <Spinner name="ball-grid-pulse" fadeIn="none" /> */}
        </LoadingWrapper>
      );
  }

  renderList(groups) {
    return (
      <ListWrapper>
        {groups.nodes.map((group, i) => (
          <GroupBoxWrapper key={i}>
            <Link href={`/${group.slug}`}>
              <GroupBox group={group} />
            </Link>
          </GroupBoxWrapper>
        ))}
      </ListWrapper>
    );
  }
}
