import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate
import os

SMTP_LOGIN = os.environ['SMTP_LOGIN']
SMTP_PASS =  os.environ['SMTP_PASS']
FROM_ADDRESS = os.environ['SMTP_FROM']

def send_mail(to_addr, subject: str, body: str):
    msg = _create_message(FROM_ADDRESS, to_addr, subject, body)
    _send(FROM_ADDRESS, to_addr, msg)


def _create_message(from_addr, to_addr, subject, body, bcc_addrs=None):
    msg = MIMEText(body)
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_addr
    if bcc_addrs:
        msg['Bcc'] = bcc_addrs
    msg['Date'] = formatdate()
    return msg


def _send(from_addr, to_addrs, msg):
    smtpobj = smtplib.SMTP('mail.bbm-a.jp', 587)
    smtpobj.ehlo()
    smtpobj.starttls()
    smtpobj.ehlo()
    smtpobj.login(SMTP_LOGIN, SMTP_PASS)
    smtpobj.sendmail(from_addr, to_addrs, msg.as_string())
    smtpobj.close()
