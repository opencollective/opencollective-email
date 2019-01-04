import React, { Component } from 'react';
import PropTypes from '../../lib/propTypes';
import { FooterWrapper, FooterTitle, FooterSubtitle } from './Styles';
import Icon from '../Icon';
import Link from '../Link';
import settings from '../../../settings.json';
import Howto from './Howto';
import { Content } from '../../styles/layout';

class Footer extends Component {
  static propTypes = {
    group: PropTypes.nodeType('Group').isRequired,
    post: PropTypes.nodeType('Post'),
  };

  render() {
    const { group, post } = this.props;
    const groupSlug = group && group.slug;
    const PostId = post && post.PostId;
    return (
      <FooterWrapper>
        <FooterTitle>
          <Link href="/" color="black">
            {settings.name}
          </Link>
        </FooterTitle>
        {groupSlug && (
          <FooterSubtitle>
            <Link href={`/${groupSlug}`} color="#333">
              {group.name}
            </Link>
          </FooterSubtitle>
        )}
        <Howto groupSlug={groupSlug} PostId={PostId} />
      </FooterWrapper>
    );
  }
}

export default Footer;
