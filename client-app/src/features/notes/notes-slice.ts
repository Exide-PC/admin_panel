import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Note {
    id: string;
    text: string;
    timestamp: number;
}

export interface NoteState {
    approvedPassword: string;
    notes: Note[];
}

const initialState: NoteState = {
    approvedPassword: '',
    notes: [],
};

export const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        receiveNotes: (state, action: PayloadAction<Note[]>) => {
            state.notes = action.payload;
        },
        receiveNote: (state, action: PayloadAction<Note>) => {
            const note = action.payload;
            const index = state.notes.findIndex(n => n.id === note.id);

            if (index === -1) {
                state.notes.unshift(note);
            }
            else {
                state.notes = state.notes.map(n => n.id === note.id ? note : n);
            }

            state.notes.sort((a, b) => b.timestamp - a.timestamp);
        },
        receivePassword: (state, action: PayloadAction<string>) => {
            state.approvedPassword = action.payload;
        },
    },
});

export default noteSlice.reducer;
export const { receiveNotes, receiveNote, receivePassword } = noteSlice.actions;