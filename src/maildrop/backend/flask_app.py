import logging
from flask import Flask
from .routes import pages, api

logger = logging.getLogger("maildrop")

app = Flask(__name__, template_folder='../frontend/templates', static_folder='../frontend/static')

app.register_blueprint(pages.bp) # load the blueprint for the all of the main web page routes
app.register_blueprint(api.bp) # load the blueprint for the all of the api routes

# disable flask's logging
logging.getLogger("werkzeug").setLevel(logging.ERROR)

# Runs the main flask app
def run_flask_server(host, port):
    logger.info(f"Starting Flask server on {host}:{port}")
    app.run(host=host, port=port, debug=False)