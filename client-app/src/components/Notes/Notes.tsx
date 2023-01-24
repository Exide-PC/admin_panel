import * as React from "react";
import { useState } from "react";
import moment from "moment";
import { Button, Input, InputGroup } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { noteActions } from "../../features/notes/note-logic";
import { getApprovedPassword, getNotes } from "../../features/notes/note-selectors";
import { uuid4 } from "../../utils/uuid64";
import { Note } from "../../features/notes/notes-slice";

interface Props {
}

const Notes = ({  }: Props) => {

    const [password, setPassword] = useState<string>('');

    const [note, setNote] = useState<Note>({
        id: '',
        text: '',
        timestamp: new Date().valueOf(),
    })
    
    const notes = useAppSelector(getNotes);
    const approvedPassword = useAppSelector(getApprovedPassword);

    const dispatch = useAppDispatch();

    const handleLogin = async () => {
        if (!password) return;

        await dispatch(noteActions.login(password))
    }

    const handleSubmit = async () => {
        if (!note.text) return;

        if (note.id) {
            await dispatch(noteActions.updateNote(note))
        }
        else {
            await dispatch(noteActions.addNote({ ...note, id: uuid4() }))
        }
    }

    return (<>
        <InputGroup style={{ width: 200 }}>
            <Input
                type='password'
                value={approvedPassword || password}
                onChange={e => setPassword(e.target.value)}
                disabled={!!approvedPassword}
                placeholder='Password'
            />
            <Button onClick={handleLogin} disabled={!!approvedPassword}>
                Login
            </Button>
        </InputGroup>
        <br/>
        <Input
            type='date'
            value={formatDate(new Date(note.timestamp))}
            onChange={e => e.target.valueAsDate && setNote({ ...note, timestamp: e.target.valueAsDate.valueOf() })}
            disabled={!approvedPassword}
        />
        <InputGroup>
            <Input
                type='textarea'
                value={note.text}
                onChange={e => setNote({ ...note, text: e.target.value })}
                disabled={!approvedPassword}
            />
            <Button onClick={handleSubmit} disabled={!approvedPassword} color={note.id ? 'warning' : 'secondary'}>
                {note.id ? 'Update' : 'Add'}
            </Button>
        </InputGroup>
        <hr/>
        {notes.map(n => 
            <div key={n.id} onClick={() => setNote(n)} style={{ cursor: 'pointer' }}>
                {moment(n.timestamp).toLocaleString()} {n.text}<br/>
            </div>
        )}
    </>
    )
}

const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();

    return `${year}-${(month + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`
}

export default Notes;