import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { TopBarWrapper } from './Styles';
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
        <Icon height={18} />
        <Link href="/" color="white">
          {settings.name}
        </Link>
        {group && (
          <Link href={`/${group.slug}`} color="#ddd">
            {group.name}
          </Link>
        )}
      </TopBarWrapper>
    );
  }
}

export default TopBar;
