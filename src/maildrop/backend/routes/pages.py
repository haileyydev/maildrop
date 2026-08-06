from flask import Blueprint, render_template, request
import maildrop.backend.config as config
import logging

logger = logging.getLogger("maildrop")

bp = Blueprint('pages', __name__)

# Log page requests
@bp.after_request
def log_after_request(response):
    logger.info(f"Page Request | {request.remote_addr} | {request.method} | {request.path} | Status: {response.status}")
    return response

# The main route that serves the website
@bp.route('/')
def index():
    return render_template('index.html', enable_sending=config.settings.ENABLE_SENDING)