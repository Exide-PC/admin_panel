from env import Environment
from repository.note_repository import Note, NoteRepository
import hashlib

class NoteService:
    def __init__(self, env: Environment, repo: NoteRepository) -> None:
        self._env = env
        self._repo = repo

    def list(self, password: str):
        self.__authorize(password)

        records = self._repo.list()
        notes = list(map(lambda r: Note(r.id, r.text, r.timestamp), records))

        return notes

    def add(self, note: Note):
        self._repo.add(note)

    def update(self, note: Note, password: str):
        self.__authorize(password)

        self._repo.update(note)

    def __authorize(self, password: str):
        expected_hash = self._env.note_password_hash

        hash_object = hashlib.md5(password.encode())
        actual_hash = hash_object.hexdigest()

        if (actual_hash != expected_hash):
            raise Exception('Incorrect password')