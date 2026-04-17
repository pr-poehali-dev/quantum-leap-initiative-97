import json
import os
import psycopg2


def handler(event: dict, context) -> dict:
    """Сохраняет или обновляет анкету пользователя после онбординга."""

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
    user_id = body.get('user_id')

    if not user_id:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'user_id обязателен'})
        }

    age = body.get('age')
    if age is not None:
        age = int(age)
        if age < 18:
            return {
                'statusCode': 400,
                'headers': {'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Возраст должен быть 18+'})
            }

    schema = os.environ['MAIN_DB_SCHEMA']
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    cur.execute(
        f"SELECT id FROM {schema}.user_profiles WHERE user_id = %s",
        (user_id,)
    )
    exists = cur.fetchone()

    photos = json.dumps(body.get('photos', []))
    everyday = json.dumps(body.get('everyday_interests', []))
    intimate = json.dumps(body.get('intimate_interests', []))

    if exists:
        cur.execute(
            f"""UPDATE {schema}.user_profiles SET
                relationship_status = %s, name = %s, age = %s, gender = %s,
                height = %s, weight = %s, eye_color = %s, city = %s,
                about_me = %s, photos = %s, everyday_interests = %s,
                intimate_interests = %s, updated_at = NOW()
                WHERE user_id = %s""",
            (
                body.get('relationship_status'),
                body.get('name'),
                age,
                body.get('gender'),
                body.get('height'),
                body.get('weight'),
                body.get('eye_color'),
                body.get('city'),
                body.get('about_me'),
                photos,
                everyday,
                intimate,
                user_id,
            )
        )
    else:
        cur.execute(
            f"""INSERT INTO {schema}.user_profiles
                (user_id, relationship_status, name, age, gender, height, weight,
                 eye_color, city, about_me, photos, everyday_interests, intimate_interests)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (
                user_id,
                body.get('relationship_status'),
                body.get('name'),
                age,
                body.get('gender'),
                body.get('height'),
                body.get('weight'),
                body.get('eye_color'),
                body.get('city'),
                body.get('about_me'),
                photos,
                everyday,
                intimate,
            )
        )

    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'user_id': user_id})
    }
