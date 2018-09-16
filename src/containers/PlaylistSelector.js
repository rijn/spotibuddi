import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Button, Intent, Callout, Spinner, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { fetchUserPlaylists } from '../api';

class PlaylistSelector extends Component {
  static propTypes = {
    username: PropTypes.string
  }

  state = {
    loading: false,
    playlists: null
  }

  componentDidMount () {
    this._fetchUserPlaylists();
  }

  _fetchUserPlaylists = async () => {
    const { username } = this.props;
    this.setState({ loading: true });
    let playlists = await fetchUserPlaylists(username);
    this.setState({ loading: false, playlists });
    console.log(username, playlists);
  }

  render () {
    const { playlists } = this.state;
    if (!playlists) return null;
    return (
      <div className="PlaylistSelector">
        <Select
            items={playlists.items}
            itemRenderer={(item) => (<p>{ item.name }</p>)}
            noResults={<MenuItem disabled={true} text="No results." />}
        >
            {/* children become the popover target; render value here */}
            <Button text={playlists.items[0].name} rightIcon="double-caret-vertical" />
        </Select>
      </div>
    );
  }
}

export default PlaylistSelector;
