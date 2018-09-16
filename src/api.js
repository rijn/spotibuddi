import axios from 'axios';
import { get } from 'lodash/fp';

const API_ENDPOINT = 'https://spotibuddi.herokuapp.com/api';

const instance = axios.create({
  baseURL: API_ENDPOINT
});

export const fetchUser = user => instance.get(`user/${user}`).then(get('data'));

export const fetchUserPlaylists = (user, offset) => instance.get(`user/${user}/playlists/${offset}`).then(get('data'));
