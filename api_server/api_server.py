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
from services.nzxt_service import NzxtConfig
from services.nzxt_worker import run_nzxt_worker


def run_api_server(container: Container):

    app = Flask(__name__)
    app.config["DEBUG"] = True

    CORS(app)

    thread = Thread(target=run_nzxt_worker, args=(container.nzxt_worker_synchronizer(),))
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
        return jsonify({})

    @app.route('/api/nzxt', methods=['GET', 'PUT'])
    @token_auth()
    def nzxt():
        if (request.method == 'GET'):
            config = container.nzxt_service().get_config()

            return jsonify({
                'color': config.color,
                'night_hours_start': config.night_hours_start,
                'night_hours_end': config.night_hours_end
            })
        else:
            json = request.json

            config = NzxtConfig(
                json['config']['color'],
                json['config']['night_hours_start'],
                json['config']['night_hours_end']
            )

            nzxt_service = container.nzxt_service()
            synchronizer = container.nzxt_worker_synchronizer()

            if (json['saveToDb']):
                nzxt_service.save_config(config)
                synchronizer.config = config

            else:
                nzxt_service.set_color(config.color)

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

    print(f'Starting Admin Panel API at {env.listener}')

    parsed = urllib.parse.urlsplit(env.listener)
    serve(app, host=parsed.hostname, port=parsed.port)