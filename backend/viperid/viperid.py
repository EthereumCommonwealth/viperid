from flask import Flask, jsonify
from viper import compiler, optimizer
from viper.parser import parse_to_lll

from .utils import body_required, get_error
from .version import VERSION

app = Flask(__name__)


@app.route('/')
def index():
    return jsonify(
        message='Viperid, online compiler for Viper language',
        version=VERSION
    )


@app.route('/abi/', methods=['POST', ])
@body_required
def compiler_to_abi(code: str):
    try:
        result = compiler.mk_full_signature(code)
    except Exception as e:
        return jsonify(
            error=get_error(e)
        )

    return jsonify(
        result=result
    )


@app.route('/ir/', methods=['POST', ])
@body_required
def compiler_to_ir(code: str):
    try:
        result = optimizer.optimize(parse_to_lll(code))
    except Exception as e:
        return jsonify(
            error=get_error(e)
        )

    return jsonify(
        result=str(result)
    )


@app.route('/bytecode/', methods=['POST', ])
@body_required
def compiler_to_bytecode(code: str):
    try:
        result = '0x' + compiler.compile(code).hex()
    except Exception as e:
        return jsonify(
            error=get_error(e)
        )

    return jsonify(
        result=result
    )
