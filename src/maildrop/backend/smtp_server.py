import logging
from aiosmtpd.controller import Controller
from . import email_parser, inbox_handler
import maildrop.backend.config as config

# Disable aiosmtpd's logging
logging.getLogger('mail.log').setLevel(logging.ERROR)

logger = logging.getLogger("maildrop")

# Class for SMTP server logic
class SMTPServer:
    # This function is called when the server receives an email
    async def handle_DATA(self, server, session, envelope):
        try:
            parsed_email = email_parser.email_bytes_to_json(envelope.content)
            if not parsed_email['To'].endswith(config.settings.DOMAIN):
                return '500 Could not process email'

            inbox_handler.recv_email(parsed_email)
        except Exception as e:
            logger.error(f"Failed to process email: {e}")
            return '500 Could not process email'

        return '250 Message accepted for delivery'

# This function sets up and runs the SMTP server
def run_smtp_server(host: str = "0.0.0.0", port: int = 25):
    logger.info(f"Starting SMTP server on {host}:{port}")

    handler = SMTPServer()
    controller = Controller(handler, hostname=host, port=port)
    
    try:
        controller.start()
    except Exception as e:
        logger.critical(f"Failed to start SMTP server: {e}")