from flask import Flask, send_from_directory, url_for
from datetime import datetime
import os

app = Flask(__name__, static_folder='build')

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

@app.route('/api/playlist')
def playlist():
    return 'Hello, World'

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)