import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Возвращает профиль пользователя по user_id."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    params = event.get('queryStringParameters') or {}
    user_id = params.get('user_id')

    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'user_id обязателен'})
        }

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"""SELECT
            u.id, u.verify_method, u.verify_value, u.is_verified,
            p.relationship_status, p.name, p.age, p.gender,
            p.height, p.weight, p.eye_color, p.city, p.about_me,
            p.photos, p.everyday_interests, p.intimate_interests
            FROM {schema}.users u
            LEFT JOIN {schema}.user_profiles p ON p.user_id = u.id
            WHERE u.id = %s""",
        (user_id,)
    )
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {
            'statusCode': 404,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Пользователь не найден'})
        }

    profile = {
        'id': row[0],
        'verify_method': row[1],
        'verify_value': row[2],
        'is_verified': row[3],
        'relationship_status': row[4],
        'name': row[5],
        'age': row[6],
        'gender': row[7],
        'height': row[8],
        'weight': row[9],
        'eye_color': row[10],
        'city': row[11],
        'about_me': row[12],
        'photos': row[13] or [],
        'everyday_interests': row[14] or [],
        'intimate_interests': row[15] or [],
    }

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps(profile, ensure_ascii=False)
    }
