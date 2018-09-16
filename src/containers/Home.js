import React, { Component } from 'react';
import { InputGroup, Button, Intent, Callout, Spinner, Alert, H1, Card } from '@blueprintjs/core';
import { fetchUser } from '../api';
import UsernameAndPlaylistInputModule from './UsernameAndPlaylistInputModule';
import '../styles/Home.css';

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
        <H1 style={{ color: 'white' }}>spotibuddi</H1>
        <Card
          className="Home_usernameAndPlaylistInputModuleContainer"
          interactive
        >
          <div className="Home_usernameAndPlaylistInputModule">
            <UsernameAndPlaylistInputModule />
          </div>
          <div className="Home_usernameAndPlaylistInputModule">
            <UsernameAndPlaylistInputModule />
          </div>
        </Card>
      </div>
    );
  }
}

export default Home;
