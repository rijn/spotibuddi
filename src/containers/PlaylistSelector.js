import '../styles/PlaylistSelector.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Button, Intent, Spinner, MenuItem, Menu } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import { fetchUserPlaylists } from '../api';
import _ from 'lodash';

class PlaylistSelector extends Component {
  static propTypes = {
    username: PropTypes.string
  }

  state = {
    loading: false,
    playlists: null,
    playlist: null
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
        labelElement={<img className="PlaylistSelector_albumRightImage" src={_.get(playlist, 'images.0.url')} />}
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
    const { playlists, playlist } = this.state;
    if (!playlists) return null;
    if (!playlists.items[0]) return null;
    return (
      <div className="PlaylistSelector">
        <Select
          itemListRenderer={this._renderMenu}
          items={playlists.items}
          itemPredicate={this._predicate}
          itemRenderer={this._renderMenuItem}
          noResults={<MenuItem disabled={true} text="No results." />}
          onItemSelect={this._handleSelectChange}
          popoverProps={{
            minimal: true
          }}
        >
          <Button
            icon={playlist ? <img className="PlaylistSelector_albumRightImage" src={_.get(playlist, 'images.0.url')} /> : null}
            rightIcon="caret-down"
            text={playlist ? `${playlist.name}` : '(No selection)'}
          />
        </Select>
      </div>
    );
  }
}

export default PlaylistSelector;
