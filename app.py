import os
import sys
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, send_from_directory, url_for, json, jsonify
from datetime import datetime

app = Flask(__name__, static_folder='build')

client_credentials_manager = SpotifyClientCredentials('40cd9cd27c7c4689bc36774f5aac188b','10d3a4b01aea4976ac89c831db901a6d')
sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)

# Serve React App
@app.route('/', defaults={'path': 'index.html'})
@app.route('/favicon.ico', defaults={'path': 'favicon.ico'})
# @app.route('/service-worker.js', defaults={'path': 'service-worker.js'})
@app.route('/static/<path:path>')
def static_file(path):
    if path != "" and os.path.exists('build/' + path):
        return send_from_directory('build', path)
    else:
        return send_from_directory('build/static', path)

@app.route('/api/<user>/playlists')
def playlists(user):
    playlists = sp.user_playlists(user)
    response = app.response_class(
        response = json.dumps(playlists),
        status = 200,
        mimetype = 'application/json'
    )
    return response

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)