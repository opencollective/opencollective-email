import React from 'react';
import PropTypes from 'prop-types';
import withIntl from '../lib/withIntl';

import Group from '../containers/GroupPage';

class GroupPage extends React.Component {
  static getInitialProps({ req, res, query }) {
    if (res && req && req.locale == 'en') {
      res.setHeader('Cache-Control', 's-maxage=300');
    }

    return { groupSlug: query && query.groupSlug, query };
  }

  static propTypes = {
    groupSlug: PropTypes.string, // from getInitialProps
    query: PropTypes.object, // from getInitialProps
    data: PropTypes.object.isRequired, // from withData
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return <Group groupSlug={this.props.groupSlug} />;
  }
}

export default withIntl(GroupPage);
