import os
from dotenv import load_dotenv

load_dotenv()

FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))

SMTP_HOST = os.getenv("SMTP_HOST", "0.0.0.0")
SMTP_PORT = int(os.getenv("SMTP_PORT", 25))

INBOX_FILE_NAME = os.getenv("INBOX_FILE_NAME", "inbox.json")
MAX_INBOX_SIZE = int(os.getenv("MAX_INBOX_SIZE", 100000000))

PROTECTED_ADDRESSES = os.getenv("PROTECTED_ADDRESSES", "^admin.*")

PASSWORD = os.getenv("PASSWORD", "password")

DOMAIN = os.getenv("DOMAIN", "haileyy.dev")

ENABLE_SENDING = os.getenv("ENABLE_SENDING", "false").lower() == "true"
RELAY_HOST = os.getenv("RELAY_HOST", "")
RELAY_PORT = int(os.getenv("RELAY_PORT", 2525))
RELAY_USER = os.getenv("RELAY_USER", "") 
RELAY_PASS = os.getenv("RELAY_PASS", "")