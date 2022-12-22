import functools
from http import HTTPStatus
import os
from typing import Any
import urllib

from flask import Flask, request, jsonify
from waitress import serve
from flask_cors import CORS
from container import Container
from env import env


def run_api_server(container: Container):

    app = Flask(__name__)
    app.config["DEBUG"] = True

    CORS(app)

    def token_auth():
        def demo_mode_auth_decorator(f: Any):
            @functools.wraps(f)
            def decorator():
                auth_header = request.headers.get('Authorization')

                if (not auth_header):
                    return ('Token was expected', HTTPStatus.UNAUTHORIZED)
                
                parts = auth_header.split(' ') # format: "Basic TOKEN"

                if (len(parts) != 2):
                    return ('Incorrect authorization header was provided', HTTPStatus.UNAUTHORIZED)

                token = parts[1]
                token_ok = token == env.token

                if (not token_ok):
                    return ('Invalid token was provided', HTTPStatus.UNAUTHORIZED)

                return f()
            return decorator
        return demo_mode_auth_decorator

    @app.route('/api/nzxt-color', methods=['POST'])
    @token_auth()
    def nzxt_color():
        os.system(f"sudo liquidctl set led1 color {request.json['color']}")
        return jsonify({})

    @app.route('/api/app', methods=['GET'])
    @token_auth()
    def init_app():
        return jsonify({})

    @app.route('/api/maintenance', methods=['GET'])
    @token_auth()
    def get_maintenance_commands():
        maintenance_service = container.maintenance_service()
        maintenance_commands = maintenance_service.get_commands()
        
        return jsonify(list(map(
            lambda c: { 'name': c.name, }, maintenance_commands
        )))

    @app.route('/api/maintenance', methods=['POST'])
    @token_auth()
    def execute_maintenance():
        command_index = request.json['command_index']
        container.maintenance_service().execute(command_index)
        return jsonify({})
    
    print(f'Starting Admin Panel API at {env.listener}')

    parsed = urllib.parse.urlsplit(env.listener)
    serve(app, host=parsed.hostname, port=parsed.port)