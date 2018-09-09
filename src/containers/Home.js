import React, { Component } from 'react';

import { fetchUser } from '../api';

class Home extends Component {
  state = {
    user: null
  }

  componentDidMount () {
    this._fetchUserInfo();
  }

  _fetchUserInfo = async () => {
    const user = await fetchUser('rijn');
    this.setState({ user });
  }

  render () {
    const { user } = this.state;
    return (
      <div className="Home">
        { JSON.stringify(user) }
      </div>
    );
  }
}

export default Home;
