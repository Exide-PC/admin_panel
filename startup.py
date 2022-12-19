import sys

from api_server.api_server import run_api_server
from container import Container

if (__name__ == '__main__'):
    container = Container()
    run_api_server(container)
