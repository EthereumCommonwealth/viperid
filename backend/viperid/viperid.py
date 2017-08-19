from flask import Flask, jsonify
from flask_cors import CORS
from viper import compiler, optimizer
from viper.parser import parse_to_lll

from viperid.utils import body_required, get_error
from viperid.version import VERSION

app = Flask(__name__)
CORS(app)


@app.route('/')
def index():
    return jsonify(
        message='Viperid, online compiler for Viper language',
        version=VERSION
    )


@app.route('/abi/', methods=['POST', ])
@body_required
def compile_to_abi(code: str):
    try:
        result = compiler.mk_full_signature(code)
    except Exception as e:
        return jsonify(
            error=get_error(e)
        ), 400

    return jsonify(
        result=result
    )


@app.route('/ir/', methods=['POST', ])
@body_required
def compile_to_ir(code: str):
    try:
        result = optimizer.optimize(parse_to_lll(code))
    except Exception as e:
        return jsonify(
            error=get_error(e)
        ), 400

    return jsonify(
        result=str(result)
    )


@app.route('/bytecode/', methods=['POST', ])
@body_required
def compile_to_bytecode(code: str):
    try:
        result = '0x' + compiler.compile(code).hex()
    except Exception as e:
        return jsonify(
            error=get_error(e)
        ), 400

    return jsonify(
        result=result
    )


@app.route('/compile/', methods=['POST',])
@body_required
def compile_all(code: str):
    try:
        result_abi = compiler.mk_full_signature(code)
    except Exception as e:
        return jsonify(
            error=get_error(e)
        ), 400

    try:
        result_ir = optimizer.optimize(parse_to_lll(code))
    except Exception as e:
        return jsonify(
            error=get_error(e)
        ), 400

    try:
        result_bytecode = '0x' + compiler.compile(code).hex()
    except Exception as e:
        return jsonify(
            error=get_error(e)
        ), 400

    return jsonify(
        result_abi=result_abi,
        result_ir=result_ir,
        result_bytecode=result_bytecode
    )