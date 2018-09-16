import React, { Component } from 'react';
import { InputGroup, Button, Intent, Callout, Spinner, Alert } from '@blueprintjs/core';
import { fetchUser } from '../api';
import UsernameAndPlaylistInputModule from './UsernameAndPlaylistInputModule';

class Home extends Component {
  state = {
    usernameA: '',
    usernameB: '',
    loading: false,
  }

  componentDidMount () {
  }

  render () {
    const { username } = this.state;
    return (
      <div className="Home">
        <UsernameAndPlaylistInputModule />
      </div>
    );
  }
}

export default Home;
