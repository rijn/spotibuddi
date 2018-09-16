import '../styles/UsernameAndPlaylistInputModule.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Button, Intent, Callout, Spinner, Alert } from '@blueprintjs/core';
import { fetchUser } from '../api';
import PlaylistSelector from './PlaylistSelector';
import _ from 'lodash';
import Promise from 'bluebird';
Promise.config({
    cancellation: true
});

class UsernameAndPlaylistInputModule extends Component {
  static propTypes = {
    onPress: PropTypes.func
  }

  state = {
    username: '',
    loading: false,
    user: null,
    isPlaylistSelectorOpen: false,
    fetchUserInfoPromise: null
  }

  _fetchUserInfo = () => {
    const { username, fetchUserInfoPromise } = this.state;
    if (fetchUserInfoPromise) {
      fetchUserInfoPromise.cancel();
    }
    if (!username) {
      this.setState({ loading: false, user: null, isPlaylistSelectorOpen: false });
      return;
    }
    this.setState({
      fetchUserInfoPromise: new Promise((resolve, reject, onCancel) => {
        this.setState({ loading: true, user: null, isPlaylistSelectorOpen: false });
        resolve(fetchUser(username));
        onCancel(() => {
          this.setState({ loading: false });
        });
      }).then(user => {
        this.setState({ loading: false, user, isPlaylistSelectorOpen: true });
      })
    });
  }

  _handleUsernameChange = event => {
    this.setState({ username: event.target.value }, () => this._fetchUserInfo());
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

  _renderPlaylistSelector = () => {
    const { isPlaylistSelectorOpen, user } = this.state;
    if (!isPlaylistSelectorOpen) return null;
    return (
      <PlaylistSelector username={user.id}/>
    );
  }

  render () {
    const { username, user } = this.state;
    return (
      <div className="UsernameAndPlaylistInputModule">
        { this._renderPlaylistSelector() }
        <InputGroup
          placeholder="Enter spotify username..."
          type="text"
          onChange={this._handleUsernameChange}
          value={this.state.username}
          large
          leftIcon={user ? (_.get(user, 'images.0.url') ? <img className="UsernameAndPlaylistInputModule_userProfileImage" src={_.get(user, 'images.0.url')} /> : 'tick') : null}
          rightElement={<span className="UsernameAndPlaylistInputModule_userDisplayName">{ _.get(user, 'display_name') || '' }</span>}
        />
        {/* { this._renderUserProfileCard() } */}
      </div>
    );
  }
}

export default UsernameAndPlaylistInputModule;
