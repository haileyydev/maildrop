from flask import Flask
from .routes import pages, api

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

app.register_blueprint(pages.bp) # load the blueprint for the all of the main web page routes
app.register_blueprint(api.bp) # load the blueprint for the all of the api routes

# Runs the main flask app
def run_flask_server(host, port):
    app.run(host=host, port=port, debug=False)