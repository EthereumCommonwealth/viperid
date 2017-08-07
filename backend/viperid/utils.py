from functools import wraps
from werkzeug.exceptions import BadRequest
from flask import request, jsonify


def body_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Set Force True to allow integration easily with any frontend.
            data = request.get_json(force=True)
        except BadRequest:
            return jsonify(
                error={
                    'message': 'Viperid only accept POST method with data json.'
                },
            ), 400
        code = data.get('code', '')

        if not code:
            return jsonify(
                error={
                    'message': 'Code field is empty'
                }
            ), 400
        return f(code, *args, **kwargs)

    return decorated_function


def get_error(e: Exception):
    message = ''
    if hasattr(e, 'msg'):
        message = e.msg
    elif hasattr(e, 'message'):
        message = e.message
    elif hasattr(e, 'args'):
        message = e.args[0]
    return {
        'message': message,
        'text': e.text if hasattr(e, 'text') else '',
        'line_no': e.lineno if hasattr(e, 'lineno') else '',
        'source_code': e.source_code if hasattr(e, 'source_code') else []
    }
