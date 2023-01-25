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
            await dispatch(noteActions.updateNote(note));
            setNote(prev => ({ ...prev, id: '' }));
        }
        else {
            await dispatch(noteActions.addNote({ ...note, id: uuid4() }));
        }

        setNote(prev => ({ ...prev, text: '' }));
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
            value={moment(note.timestamp).format('yyyy-MM-DD')}
            onChange={e => e.target.valueAsDate && setNote({ ...note, timestamp: e.target.valueAsDate.valueOf() })}
        />
        <InputGroup>
            <Input
                type='textarea'
                value={note.text}
                onChange={e => setNote({ ...note, text: e.target.value })}
            />
            {note.id &&
                <Button outline onClick={() => setNote({ ...note, text: '', id: '' })} disabled={!approvedPassword}>
                    Cancel
                </Button>
            }
            <Button onClick={handleSubmit} color={note.id ? 'warning' : 'secondary'}>
                {note.id ? 'Update' : 'Add'}
            </Button>
        </InputGroup>
        <hr/>
        {notes.map(n => 
            <div key={n.id} onClick={() => setNote(n)} style={{ cursor: 'pointer' }}>
                <span style={{ color: n.id === note.id ? 'orange' : undefined }}>
                    <small>{moment(n.timestamp).format('MM/DD/yyyy')}:</small> {n.text}<br/> {/* https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/ */}
                </span>
            </div>
        )}
    </>
    )
}

export default Notes;