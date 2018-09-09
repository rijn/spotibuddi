from flask import Flask, send_from_directory
from datetime import datetime
import os
app = Flask(__name__)

# @app.route('/')
# def homepage():
#     the_time = datetime.now().strftime("%A, %d %b %Y %l:%M %p")

#     return """
#     <h1>Hello heroku</h1>
#     <p>It is currently {time}.</p>

#     <img src="http://loremflickr.com/600/400">
#     """.format(time=the_time)

app = Flask(__name__, static_folder='static')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("static/" + path):
        return send_from_directory('static', path)
    else:
        return send_from_directory('static', 'index.html')

if __name__ == '__main__':
    app.run(debug=True, use_reloader=True)