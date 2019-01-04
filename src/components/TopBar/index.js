import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TopBarWrapper, TopBarItem } from './Styles';
import Icon from '../Icon';
import Link from '../Link';
import settings from '../../../settings.json';

class TopBar extends Component {
  static propTypes = {
    group: PropTypes.object,
  };

  render() {
    const { group } = this.props;
    return (
      <TopBarWrapper>
        <TopBarItem>
          <Icon height={18} />
        </TopBarItem>
        <TopBarItem>
          <Link href="/" color="white">
            {settings.name}
          </Link>
        </TopBarItem>
        {group && (
          <TopBarItem>
            <Link href={`/${group.slug}`} color="#ddd">
              {group.name}
            </Link>
          </TopBarItem>
        )}
      </TopBarWrapper>
    );
  }
}

export default TopBar;
