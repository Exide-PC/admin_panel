from dataclasses import dataclass
from sqlite3 import Connection
from typing import List


@dataclass
class Note:
    id: str
    text: str
    timestamp: int

class NoteRepository:
    def __init__(self, con: Connection) -> None:
        self._con = con
    
    def list(self) -> List[Note]:
        records = self._con.cursor().execute('SELECT * FROM notes ORDER BY timestamp desc').fetchall()
        return list(map(lambda r: Note(r['id'], r['text'], r['timestamp']), records))

    def add(self, note: Note):
        record = (note.id, note.timestamp, note.text)
        self._con.cursor().execute('INSERT INTO notes (id, timestamp, text) VALUES (?, ?, ?)', record)
        self._con.commit()

    def update(self, note: Note):
        record = (note.timestamp, note.text, note.id)
        self._con.cursor().execute('UPDATE notes SET timestamp = ?, text = ? WHERE id = ?', record)
        self._con.commit()