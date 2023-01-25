import _fetch from "../../_fetch";
import { Note } from "./notes-slice";

export async function fetchNotes(password: string): Promise<Note[]> {
    return await _fetch<Note[]>(`api/note?password=${password}`, 'GET');
}

export async function fetchCreateNote(note: Note): Promise<void> {
    return await _fetch(`api/note`, 'POST', note);
}

export async function fetchUpdateNote(note: Note, password: string): Promise<void> {
    return await _fetch(`api/note?password=${password}`, 'PUT', note);
}