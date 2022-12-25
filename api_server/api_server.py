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

    @app.route('/api/app', methods=['GET'])
    @token_auth()
    def init_app():
        appsettings = container.appsettings_service().get()

        return jsonify({
            'nzxt_color': appsettings.nzxt_color,
            'nzxt_night_hours_start': appsettings.nzxt_night_hours_start,
            'nzxt_night_hours_end': appsettings.nzxt_night_hours_end
        })

    @app.route('/api/app', methods=['PATCH'])
    @token_auth()
    def patch_app():
        json = request.json        

        service = container.appsettings_service()
        settings = service.get()
        
        settings.nzxt_color = json['nzxt_color'] if 'nzxt_color' in json else settings.nzxt_color
        settings.nzxt_night_hours_start = json['nzxt_night_hours_start'] if 'nzxt_night_hours_start' in json else settings.nzxt_night_hours_start
        settings.nzxt_night_hours_end = json['nzxt_night_hours_end'] if 'nzxt_night_hours_end' in json else settings.nzxt_night_hours_end

        service.update(settings)

        container.nzxt_service().set_color(settings.nzxt_color)

        return jsonify({
            'nzxt_color': settings.nzxt_color,
            'nzxt_night_hours_start': settings.nzxt_night_hours_start,
            'nzxt_night_hours_end': settings.nzxt_night_hours_end
        })

    @app.route('/api/maintenance', methods=['GET'])
    @token_auth()
    def get_maintenance_commands():
        maintenance_service = container.maintenance_service()
        maintenance_commands = maintenance_service.get_commands()
        
        return jsonify(list(map(
            lambda c: { 'id': c.id, 'name': c.name, 'group': c.group }, maintenance_commands
        )))

    @app.route('/api/maintenance', methods=['POST'])
    @token_auth()
    def execute_maintenance():
        command_id = request.json['command_id']
        container.maintenance_service().execute(command_id)
        return jsonify({})
    
    print(f'Starting Admin Panel API at {env.listener}')

    parsed = urllib.parse.urlsplit(env.listener)
    serve(app, host=parsed.hostname, port=parsed.port)