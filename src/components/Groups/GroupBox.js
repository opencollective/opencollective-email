import React from 'react';
import PropTypes from '../../lib/propTypes';
import { GroupBoxWrapper, Name, Metadata, GroupEmail } from './Styles';
import env from '../../env.frontend';
import Link from '../Link';

export default function GroupBox({ group }) {
  const groupEmail = `${group.slug}@${env.DOMAIN}`;
  return (
    <GroupBoxWrapper color={group.color}>
      <Name>{group.name}</Name>
      <GroupEmail>
        <Link mailto={groupEmail} color="#555">
          {groupEmail}
        </Link>
      </GroupEmail>
      <Metadata>
        {group.followers.total} followers | {group.posts.total} posts
      </Metadata>
    </GroupBoxWrapper>
  );
}

GroupBox.propTypes = {
  group: PropTypes.nodeType('Group').isRequired,
};
