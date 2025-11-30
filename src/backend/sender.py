import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import config

# send an email
def send_email(from_address, to_address, subject, body):
    if config.ENABLE_SENDING == False:
        return False, "Sending is disabled"

    message = MIMEMultipart()
    message["From"] = from_address
    message["To"] = to_address
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    server = None

    try:
        if config.RELAY_PORT == 465:
            context = ssl.create_default_context()
            server = smtplib.SMTP_SSL(config.RELAY_HOST, config.RELAY_PORT, context=context)
        else:
            server = smtplib.SMTP(config.RELAY_HOST, config.RELAY_PORT)
            server.starttls()

        if config.RELAY_USER and config.RELAY_PASS:
            server.login(config.RELAY_USER, config.RELAY_PASS)
        
        server.send_message(message)
        server.quit()

        return True, "Sent successfully"
    except Exception as e:
        if server:
            server.quit()
        return False, str(e)