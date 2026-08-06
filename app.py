import os
import sys
import threading
import logging
from src.backend.logging import setup_logging

if __name__ == "__main__":
    setup_logging(level=logging.INFO)
    logger = logging.getLogger("maildrop")

    # Check if the script is run as root
    if os.geteuid() != 0:
        logger.critical("Maildrop must be ran as root.")
        sys.exit(1)

    # import backend after logging is set up to report errors
    import src.backend.config as config
    from src.backend.flask_app import run_flask_server
    from src.backend.smtp_server import run_smtp_server

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