import os
import sys
import spotipy
import spotipy.util as util
from spotipy.oauth2 import SpotifyClientCredentials
from flask import Flask, send_from_directory, url_for, json, jsonify, make_response, request, current_app
from datetime import datetime, timedelta
from functools import update_wrapper

app = Flask(__name__, static_folder='build')

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, list):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, list):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator

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
@crossdomain(origin='*')
def playlists(user):
    playlists = sp.user_playlists(user)
    response = app.response_class(
        response = json.dumps(playlists),
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route('/api/<user>')
@crossdomain(origin='*')
def user(user):
    user = sp.user(user)
    response = app.response_class(
        response = json.dumps(user),
        status = 200,
        mimetype = 'application/json'
    )
    return response

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)