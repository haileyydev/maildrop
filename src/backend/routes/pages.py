from flask import Blueprint, render_template

bp = Blueprint('pages', __name__)

# The main route that serves the website
@bp.route('/')
def index():
    return render_template('index.html')