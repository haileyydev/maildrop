import logging
import sys
from pydantic import Field, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger("maildrop")

# define all possible settings
class Settings(BaseSettings):
    FLASK_HOST: str = "0.0.0.0"
    FLASK_PORT: int = Field(default=5000, ge=1, le=65535)
    SMTP_HOST: str = "0.0.0.0"
    SMTP_PORT: int = Field(default=25, ge=1, le=65535)
    INBOX_FILE_NAME: str = "inbox.json"
    MAX_INBOX_SIZE: int = Field(default=100000000, ge=1)
    PROTECTED_ADDRESSES: str = "^admin.*"
    PASSWORD: str = "password"
    DOMAIN: str = "yourdomain.com"
    ENABLE_SENDING: bool = False
    RELAY_HOST: str = ""
    RELAY_PORT: int = Field(default=2525, ge=1, le=65535)
    RELAY_USER: str = ""
    RELAY_PASS: str = ""

    model_config = SettingsConfigDict(env_file=".env")

try:
    settings = Settings()
    logger.info("Loaded configuration.")
except ValidationError as e:
    logger.critical("Configuration Error! Maildrop cannot start.")

    # print the errors in a clean way
    for error in e.errors():
        # gets the name of the field and the error message
        field_name = error['loc'][0]
        error_message = error['msg']
    
        logger.critical(f"{field_name}: {error_message}")
        
    sys.exit(1)