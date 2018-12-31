import React from 'react';
import PropTypes from 'prop-types';
import withIntl from '../lib/withIntl';

import Post from '../containers/PostPage';

class PostPage extends React.Component {
  static getInitialProps({ req, res, query }) {
    if (res && req && req.locale == 'en') {
      res.setHeader('Cache-Control', 's-maxage=300');
    }

    return { postSlug: query && query.postSlug, query };
  }

  static propTypes = {
    postSlug: PropTypes.string, // from getInitialProps
    query: PropTypes.object, // from getInitialProps
    data: PropTypes.object.isRequired, // from withData
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  render() {
    return <Post postSlug={this.props.postSlug} />;
  }
}

export default withIntl(PostPage);
