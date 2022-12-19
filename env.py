import os
from dotenv import load_dotenv

class Environment:
    def __init__(self):
        self.token = os.getenv('TOKEN')
        self.listener = os.getenv('LISTENER')

load_dotenv()
env = Environment()