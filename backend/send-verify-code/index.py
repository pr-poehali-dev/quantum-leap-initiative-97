import json
import os
import random
import string
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет 6-значный код верификации на email пользователя."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    verify_method = body.get('method', 'email')
    verify_value = body.get('value', '').strip().lower()

    if not verify_value:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Укажи email или телефон'})
        }

    code = ''.join(random.choices(string.digits, k=6))

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"INSERT INTO {schema}.verify_codes (verify_value, code) VALUES (%s, %s)",
        (verify_value, code)
    )
    conn.commit()
    cur.close()
    conn.close()

    if verify_method == 'email':
        _send_email(verify_value, code)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'method': verify_method})
    }


def _send_email(to_email: str, code: str):
    smtp_host = os.environ.get('SMTP_HOST', '')
    smtp_port = int(os.environ.get('SMTP_PORT', '587'))
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASSWORD', '')

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Desire Universe — код подтверждения: {code}'
    msg['From'] = smtp_user
    msg['To'] = to_email

    html = f"""
    <div style="font-family:sans-serif;max-width:420px;margin:0 auto;background:#0d0d0d;color:#fff;padding:32px;border-radius:16px;border:1px solid rgba(236,72,153,0.3)">
      <h2 style="background:linear-gradient(90deg,#f472b6,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin:0 0 8px">Desire Universe 🔥</h2>
      <p style="color:#9ca3af;margin:0 0 24px">Твой код для входа:</p>
      <div style="font-size:40px;font-weight:bold;letter-spacing:10px;text-align:center;color:#f472b6;padding:20px;background:rgba(236,72,153,0.1);border-radius:12px;margin-bottom:20px">{code}</div>
      <p style="color:#6b7280;font-size:12px">Код действует 10 минут. Никому не сообщай его.</p>
    </div>
    """
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())
