import functools
from http import HTTPStatus
import os
from threading import Thread
from typing import Any
import urllib

from flask import Flask, request, jsonify
from waitress import serve
from flask_cors import CORS
from container import Container
from env import env
from repository.nzxt_config_repository import NzxtConfig


def run_api_server(container: Container):

    app = Flask(__name__)
    app.config["DEBUG"] = True

    CORS(app)

    thread = Thread(target=container.nzxt_worker().loop)
    thread.daemon = True
    thread.start()

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

    @app.route('/api/app', methods=['GET'])
    @token_auth()
    def init_app():
        appsettings = container.appsettings_service().get()

        return jsonify({
            'nzxt_config_id': appsettings.nzxt_config_id
        })

    @app.route('/api/nzxt', methods=['GET', 'PUT'])
    @token_auth()
    def nzxt():
        if (request.method == 'GET'):
            configs = container.nzxt_config_service().list()

            return jsonify(list(map(lambda c: {
                'id': c.id,
                'color_args': c.color_args,
                'night_hours_start': c.night_hours_start,
                'night_hours_end': c.night_hours_end
            }, configs)))
        else:
            json = request.json

            config = NzxtConfig(
                json['id'],
                json['color_args'],
                json['night_hours_start'],
                json['night_hours_end']
            )

            container.nzxt_config_service().update(config)
            container.appsettings_service().update_nzxt_config_id(config.id)

            container.nzxt_worker().iteration(config)

            return ('', HTTPStatus.NO_CONTENT)

    @app.route('/api/maintenance', methods=['GET', 'POST'])
    @token_auth()
    def maintenance():
        maintenance = container.maintenance_service()

        if (request.method == 'GET'):
            maintenance_commands = maintenance.get_commands()

            return jsonify(list(map(
                lambda c: { 'id': c.id, 'name': c.name, 'group': c.group }, maintenance_commands
            )))
        else:
            command_id = request.json['command_id']
            maintenance.execute(command_id)

            return ('', HTTPStatus.NO_CONTENT)

    print(f'Starting Admin Console API at {env.listener}')

    parsed = urllib.parse.urlsplit(env.listener)
    serve(app, host=parsed.hostname, port=parsed.port)