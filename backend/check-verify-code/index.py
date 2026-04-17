import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Проверяет код верификации и создаёт/возвращает пользователя."""

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
    code = body.get('code', '').strip()

    if not verify_value or not code:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Укажи значение и код'})
        }

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"""SELECT id FROM {schema}.verify_codes
            WHERE verify_value = %s AND code = %s AND used = FALSE AND expires_at > NOW()
            ORDER BY created_at DESC LIMIT 1""",
        (verify_value, code)
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный или просроченный код'})
        }

    code_id = row[0]
    cur.execute(
        f"UPDATE {schema}.verify_codes SET used = TRUE WHERE id = %s",
        (code_id,)
    )

    cur.execute(
        f"""INSERT INTO {schema}.users (verify_method, verify_value, is_verified)
            VALUES (%s, %s, TRUE)
            ON CONFLICT (verify_value) DO UPDATE SET is_verified = TRUE
            RETURNING id""",
        (verify_method, verify_value)
    )
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'user_id': user_id})
    }
