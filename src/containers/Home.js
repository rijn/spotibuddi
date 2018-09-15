import React, { Component } from 'react';
import { InputGroup, Button, Intent, Callout, Spinner } from '@blueprintjs/core';

import { fetchUser } from '../api';

class Home extends Component {
  state = {
    usernameA: '',
    usernameB: '',
    loading: false,
    user: null
  }

  componentDidMount () {
  }

  _fetchUserInfo = usernameKey => async () => {
    const username = this.state[usernameKey];
    this.setState({ loading: true });
    const user = await fetchUser(username);
    this.setState({ loading: false, user });
  }

  _handleUsernameChange = username => event => {
    this.setState({ [ username ]: event.target.value });
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

  _renderUsernameInputBox = (username, prompt) => {
    return (
      <div>
        <div className="Home_prompt">{ prompt }</div>
        <InputGroup
          placeholder="Enter your spotify username..."
          type="text"
          onChange={this._handleUsernameChange(username)}
          value={this.state[username]}
          rightElement={
            <Button
              icon="arrow-right"
              text="Go"
              onClick={this._fetchUserInfo(username)}
            />
          }
        />
      </div>
    );
  }

  render () {
    const { username } = this.state;
    return (
      <div className="Home">

        { this._renderUsernameInputBox('usernameA', 'User 1') }
        { this._renderUsernameInputBox('usernameB', 'User 2') }
        <Button
          icon="arrow-right"
          text="Go"
          onClick={this._fetchUserInfo}
        />
        { this._renderUserProfileCard() }
      </div>
    );
  }
}

export default Home;
