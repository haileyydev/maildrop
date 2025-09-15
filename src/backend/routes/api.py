from flask import Blueprint, render_template, request, jsonify
from .. import inbox_handler
import config
import re
import random
import string

bp = Blueprint('api', __name__)

# Make a random email containing 6 characters
@bp.route('/get_random_address')
def get_random_address():
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return jsonify({"address": f"{random_string}@{config.DOMAIN}"}), 200

# Get an email domain
@bp.route('/get_domain')
def get_domain():
    return jsonify({"domain": config.DOMAIN}), 200

# The main route that serves the website
@bp.route('/get_inbox')
def get_inbox():
    addr = request.args.get("address", "")
    password = request.headers.get("Authorization", None)

    if re.match(config.PROTECTED_ADDRESSES, addr) and password != config.PROTECTED_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401

    inbox = inbox_handler.read_inbox()
    address_inbox = inbox.get(addr, [])
    return jsonify(address_inbox), 200