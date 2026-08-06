import os
import sys
import threading
import logging
from maildrop.backend.logging import setup_logging

def main():
    setup_logging(level=logging.INFO)
    logger = logging.getLogger("maildrop")

    import maildrop.backend.config as config

    # Check if the script needs root
    if (config.settings.FLASK_PORT < 1024 or config.settings.SMTP_PORT < 1024) and os.geteuid() != 0:
        logger.critical("Maildrop must be ran as root if binding to a port below 1024.")
        sys.exit(1)

    from maildrop.backend.flask_app import run_flask_server
    from maildrop.backend.smtp_server import run_smtp_server

    # Start the web server and SMTP server in separate threads
    flask_thread = threading.Thread(target=run_flask_server, args=(config.settings.FLASK_HOST, config.settings.FLASK_PORT))
    smtp_thread = threading.Thread(target=run_smtp_server, args=(config.settings.SMTP_HOST, config.settings.SMTP_PORT))

    flask_thread.start()
    smtp_thread.start()

    # Run forever until interrupted
    try:
        flask_thread.join()
        smtp_thread.join()
    except KeyboardInterrupt:
        logger.info("Stopping Server")
        os._exit(0)