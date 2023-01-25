import { AppThunk } from "../../app/store";
import { fetchCreateNote, fetchNotes, fetchUpdateNote } from "./note-api";
import { getApprovedPassword } from "./note-selectors";
import { Note, receiveNote, receiveNotes, receivePassword } from "./notes-slice";

export const noteActions = {
    login: (password: string): AppThunk => async (dispatch, getState) => {
        const notes = await fetchNotes(password);
        dispatch(receiveNotes(notes));
        dispatch(receivePassword(password));
    },
    addNote: (note: Note): AppThunk => async (dispatch, getState) => {
        await fetchCreateNote(note);
        dispatch(receiveNote(note));
    },
    updateNote: (note: Note): AppThunk => async (dispatch, getState) => {
        const password = getApprovedPassword(getState());
        await fetchUpdateNote(note, password);
        dispatch(receiveNote(note));
    },
}