import '../styles/PlaylistSelector.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Button, Intent, Spinner, MenuItem, Menu } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { fetchUserPlaylists } from '../api';
import _ from 'lodash';
import Promise from 'bluebird';
import update from 'immutability-helper';

class PlaylistSelector extends Component {
  static propTypes = {
    username: PropTypes.string
  }

  state = {
    loading: false,
    playlists: null,
    playlist: null,
    fetchUserPlaylistsPromise: null,
    total: 0
  }

  componentDidMount () {
    this._fetchUserPlaylists();
  }

  componentWillUnmount () {
    const { fetchUserPlaylistsPromise } = this.state;
    if (fetchUserPlaylistsPromise) fetchUserPlaylistsPromise.cancel();
  }

  _fetchUserPlaylists = () => {
    const { username } = this.props;
    const { fetchUserPlaylistsPromise, playlists } = this.state;
    this.setState({
      loading: true,
      fetchUserPlaylistsPromise: new Promise((resolve, reject, onCancel) => {
        resolve(fetchUserPlaylists(username, _.get(playlists, 'length') || 0));
      }).then(_playlists => {
        this.setState(update(this.state, {
          playlists: playlists ? { $push: _.get(_playlists, 'items') } : { $set: _.get(_playlists, 'items') },
          total: { $set: _playlists.total }
        }));
        if (!_playlists.next) {
          this.setState({ loading: false });
        } else {
          return this._fetchUserPlaylists();
        }
      })
    });
  }

  _escapeRegExpChars = (text) => {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  }

  _highlightText = (text, query) => {
    let lastIndex = 0;
    const words = query
      .split(/\s+/)
      .filter(word => word.length > 0)
      .map(this._escapeRegExpChars);
    if (words.length === 0) {
      return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens: React.ReactNode[] = [];
    while (true) {
      const match = regexp.exec(text);
      if (!match) {
        break;
      }
      const length = match[0].length;
      const before = text.slice(lastIndex, regexp.lastIndex - length);
      if (before.length > 0) {
        tokens.push(before);
      }
      lastIndex = regexp.lastIndex;
      tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
      tokens.push(rest);
    }
    return tokens;
  }

  _renderMenuItem = (playlist, { handleClick, modifiers, query }) => {
    const { playlists } = this.state;
    if (!modifiers.matchesPredicate) {
      return null;
    }
    const text = `${playlist.name}`;
    return (
      <MenuItem
        active={modifiers.active}
        key={playlist.id}
        onClick={handleClick}
        text={text}
        shouldDismissPopover={false}
        text={this._highlightText(text, query)}
        labelElement={playlists.length > 200 ? null : <img className="PlaylistSelector_albumRightImage" src={_.get(playlist, 'images.0.url')} />}
      />
    );
  };

  _predicate = (query, playlist) => {
    return `${playlist.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
  };

  _handleSelectChange = (playlist) => this.setState({ playlist });

  _renderMenu = ({ items, itemsParentRef, query, renderItem }) => {
    const renderedItems = items.map(renderItem).filter(item => item != null);
    return (
      <Menu ulRef={itemsParentRef} className="PlaylistSelector_menu">
        { query && (
          <MenuItem
            disabled={true}
            text={`Found ${renderedItems.length} items matching "${query}"`}
          />
        ) }
        {renderedItems}
      </Menu>
    );
  };

  render () {
    const { playlists, playlist, total, loading } = this.state;
    if (!playlists) return null;
    if (!playlists[0]) return null;
    return (
      <div className="PlaylistSelector">
        <Select
          itemListRenderer={this._renderMenu}
          items={playlists}
          itemPredicate={this._predicate}
          itemRenderer={this._renderMenuItem}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={this._handleSelectChange}
          popoverProps={{
            minimal: true
          }}
        >
          <Button
            icon={(loading && total)
              ? (<Spinner size={30} value={playlists.length / total} />)
              : (playlist
                ? <img className="PlaylistSelector_albumRightImage" src={_.get(playlist, 'images.0.url')} />
                : null)}
            rightIcon="caret-down"
            text={playlist ? `${playlist.name}` : '(No selection)'}
            large
            fill
          />
        </Select>
      </div>
    );
  }
}

export default PlaylistSelector;
