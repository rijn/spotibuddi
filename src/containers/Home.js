import React, { Component } from 'react';
import { InputGroup, Button, Intent, Callout, Spinner } from '@blueprintjs/core';

import { fetchUser } from '../api';

class Home extends Component {
  state = {
    username: '',
    loading: false,
    user: null
  }

  componentDidMount () {
  }

  _fetchUserInfo = async () => {
    const { username } = this.state;
    this.setState({ loading: true });
    const user = await fetchUser(username);
    this.setState({ loading: false, user });
  }

  _handleUsernameChange = event => {
    this.setState({ username: event.target.value });
  }

  _renderUserProfileCard = () => {
    const { user, loading } = this.state;
    if (loading) {
      return (
        <Spinner />
      );
    }
    if (!user) return null;
    return (
      <Callout
        intent={Intent.PRIMARY}
      >
        { JSON.stringify(user) }
      </Callout>
    )
  }

  render () {
    const { username } = this.state;
    return (
      <div className="Home">
        <InputGroup
          placeholder="Enter your spotify username..."
          rightElement={
            <Button
              icon="arrow-right"
              minimal={true}
              onClick={this._fetchUserInfo}
            />
          }
          type="text"
          onChange={this._handleUsernameChange}
          value={username}
        />
        { this._renderUserProfileCard() }
      </div>
    );
  }
}

export default Home;
