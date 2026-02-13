import os
import sys
import threading
import config
from src.backend.flask_app import run_flask_server
from src.backend.smtp_server import run_smtp_server

if __name__ == "__main__":
    if hasattr(os, "geteuid"):
        if os.geteuid() != 0:
            print("script must be run as root")
            sys.exit(1)

    flask_thread = threading.Thread(target=run_flask_server, args=(config.FLASK_HOST, config.FLASK_PORT))
    smtp_thread = threading.Thread(target=run_smtp_server, args=(config.SMTP_HOST, config.SMTP_PORT))

    flask_thread.start()
    smtp_thread.start()

    try:
        flask_thread.join()
        smtp_thread.join()
    except KeyboardInterrupt:
        print("Stopping server.")
        os._exit(0)
