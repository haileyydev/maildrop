# Flask server config
FLASK_HOST = "0.0.0.0"
FLASK_PORT = 5000

# SMTP server config
SMTP_HOST = "0.0.0.0"
SMTP_PORT = 25

# File config
INBOX_FILE_NAME = "inbox.json"
MAX_INBOX_SIZE = 100*(10**6) # 100MB (in bytes) (clears inbox when reached)

# Email config
PROTECTED_ADDRESSES = "^me.*" # regex for inboxes that need a password

# Password
PASSWORD = "password" # admin password needed to access protected emails, change settings (not implemented), etc.

# Domain config
DOMAIN = "haileyy.dev"