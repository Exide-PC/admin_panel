# type: ignore

import functools
from http import HTTPStatus
from threading import Thread
from typing import Any
from datetime import datetime
import urllib

from flask import Flask, request, jsonify
from waitress import serve
from flask_cors import CORS
from container import Container
from env import env
from repository.nzxt_config_repository import NzxtConfig
from services.note_service import Note


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
            def decorator(*args, **kwargs):
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

                try:
                    return f(*args, **kwargs)
                except Exception as e:
                    return (str(e), HTTPStatus.INTERNAL_SERVER_ERROR)

            return decorator
        return demo_mode_auth_decorator

    @app.route('/api/app', methods=['GET'])
    @token_auth()
    def init_app():
        appsettings = container.appsettings_service().get()

        return jsonify({
            'nzxt_config_id': appsettings.nzxt_config_id
        })

    @app.route('/api/nzxt/config', methods=['GET', 'POST', 'PUT', 'DELETE'])
    @token_auth()
    def nzxt_config():
        if (request.method == 'GET'):
            configs = container.nzxt_config_service().list()

            return jsonify(list(map(lambda c: {
                'id': c.id,
                'name': c.name,
                'color_args': c.color_args,
                'night_hours_start': c.night_hours_start,
                'night_hours_end': c.night_hours_end,
                'fan_speed': c.fan_speed
            }, configs)))
        elif (request.method == 'POST'):
            json = request.json

            config = NzxtConfig(
                json['id'],
                json['name'],
                json['color_args'],
                json['night_hours_start'],
                json['night_hours_end'],
                json['fan_speed']
            )

            container.nzxt_config_service().create(config)
            container.appsettings_service().update_nzxt_config_id(config.id)

            container.nzxt_worker().iteration(config)

            return ('', HTTPStatus.NO_CONTENT)
        elif (request.method == 'PUT'):
            json = request.json

            config = NzxtConfig(
                json['id'],
                json['name'],
                json['color_args'],
                json['night_hours_start'],
                json['night_hours_end'],
                json['fan_speed']
            )

            container.nzxt_config_service().update(config)
            container.appsettings_service().update_nzxt_config_id(config.id)

            container.nzxt_worker().iteration(config)

            return ('', HTTPStatus.NO_CONTENT)
        elif (request.method == 'DELETE'):
            config_id = request.json['id']

            configs = container.nzxt_config_service().list()
            next_config = next(c for c in configs if c.id != config_id)

            container.appsettings_service().update_nzxt_config_id(next_config.id)
            container.nzxt_config_service().delete(config_id)

            container.nzxt_worker().iteration(next_config)

            return ('', HTTPStatus.NO_CONTENT)

    @app.route('/api/nzxt/status', methods=['GET'])
    @token_auth()
    def nzxt_status():
        status = container.nzxt_status_service().get_status()

        return jsonify({
            'cpu_temperature': status.cpu_temperature
        })

    @app.route('/api/maintenance', methods=['GET', 'POST'])
    @token_auth()
    def maintenance():
        maintenance = container.maintenance_service()

        if (request.method == 'GET'):
            maintenance_commands = maintenance.get_commands()

            return jsonify(list(map(
                lambda c: {
                    'id': c.id,
                    'name': c.name,
                    'group': c.group
                },
                maintenance_commands
            )))
        else:
            command_id = request.json['command_id']
            maintenance.execute(command_id)

            return ('', HTTPStatus.NO_CONTENT)

    @app.route('/api/maintenance/journal', methods=['GET'])
    @token_auth()
    def journal():
        journals = container.journal_service().list()

        return jsonify(list(map(
            lambda c: {
                'id': c.id,
                'name': c.name
            },
            journals
        )))

    @app.route('/api/maintenance/journal/<id>', methods=['GET'])
    @token_auth()
    def journal_logs(id: str):
        count = request.args.get("count", type=int)
        output = request.args.get("output", type=str)
        logs = container.journal_service().logs(id, count, output)
        return jsonify(logs)
    
    @app.route('/api/note', methods=['GET', 'POST', 'PUT'])
    @token_auth()
    def note():
        note_service = container.note_service()

        if (request.method == 'GET'):
            password = request.args['password']
            notes = note_service.list(password)

            return jsonify(list(map(
                lambda n: {
                    'id': n.id,
                    'text': n.text,
                    'timestamp': n.timestamp
                },
                notes
            )))

        elif (request.method == 'POST'):
            note = Note(
                id=request.json['id'],
                text=request.json['text'],
                timestamp=request.json['timestamp']
            )

            note_service.add(note)

            return ('', HTTPStatus.NO_CONTENT)

        elif (request.method == 'PUT'):
            note = Note(
                id=request.json['id'],
                text=request.json['text'],
                timestamp=request.json['timestamp']
            )

            password = request.args['password']
            note_service.update(note, password)

            return ('', HTTPStatus.NO_CONTENT)

    print(f'Starting Admin Console API at {env.listener}')

    parsed = urllib.parse.urlsplit(env.listener)
    serve(app, host=parsed.hostname, port=parsed.port)