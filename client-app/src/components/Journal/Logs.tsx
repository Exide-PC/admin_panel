import * as React from "react";
import { useMemo, useRef, useState } from "react";
import _ from "lodash";
import { DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, Label, UncontrolledDropdown } from "reactstrap";
import { JournalOutput, fetchJournalLogs } from "../../features/maintenance/maintenance-api";
import { useJournals } from "../../features/maintenance/maintenance-logic";
import { Journal } from "../../features/maintenance/maintenance-slice";

interface Props {
}

const useDebounce = () => {
    const debounceRef = useRef<_.DebouncedFunc<() => Promise<void>>>();

    return (fun: () => Promise<void>) => {
        debounceRef.current?.cancel(); // resetting previous if any

        debounceRef.current = _.debounce(fun, 300);
        debounceRef.current();
    }
}

const Logs = ({  }: Props) => {

    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [count, setCount] = useState<number>(50);
    const [output, setOutput] = useState<JournalOutput>('short');
    const [ascending, setAscending] = useState<boolean>(false);
    
    const [journals] = useJournals();

    const debounce = useDebounce();

    const handleChange = (j: Journal | null, c: number, o: JournalOutput) => {
        setSelectedJournal(j);
        setCount(c);
        setOutput(o)

        if (!j) return;

        debounce(async () => {
            setLoading(true);
            const result = await fetchJournalLogs(j.id, c, o);
            setLogs(result);
            setLoading(false);
        })
    }

    const sortedLogs = useMemo(() => {
        if (ascending)
            return logs;

        return [...logs].reverse();
    }, [logs, ascending]);
    
    return (
        <FormGroup>
            <FormGroup>
                <InputGroup>
                    <UncontrolledDropdown>
                        <DropdownToggle caret disabled={loading}>
                            {selectedJournal?.name ?? '<Select>'}
                        </DropdownToggle>
                        <DropdownMenu dark>
                            {journals.map(j => (
                                <DropdownItem key={j.id} onClick={() => handleChange(j, count, output)}>
                                    {j.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <Input
                        style={{ maxWidth: 110, minWidth: 110 }}
                        type='number'
                        value={count}
                        onChange={e => handleChange(selectedJournal, e.target.valueAsNumber, output)}
                        placeholder='Count'
                    />
                    <UncontrolledDropdown>
                        <DropdownToggle caret outline>
                            {output}
                        </DropdownToggle>
                        <DropdownMenu dark>
                            <DropdownItem onClick={() => handleChange(selectedJournal, count, 'short')}>
                                short
                            </DropdownItem>
                            <DropdownItem onClick={() => handleChange(selectedJournal, count, 'short-precise')}>
                                short-precise
                            </DropdownItem>
                            <DropdownItem onClick={() => handleChange(selectedJournal, count, 'cat')}>
                                cat
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <UncontrolledDropdown>
                        <DropdownToggle caret outline>
                            {ascending ? "asc" : "desc"}
                        </DropdownToggle>
                        <DropdownMenu dark>
                            <DropdownItem onClick={() => setAscending(true)}>
                                Ascending
                            </DropdownItem>
                            <DropdownItem onClick={() => setAscending(false)}>
                                Descending
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </InputGroup>
            </FormGroup>
            <FormGroup style={{ whiteSpace: 'pre-wrap' }}>
                {sortedLogs.map((l, i) => (
                    <React.Fragment key={i}>
                        <LogRow text={l}/>
                        <br/>
                    </React.Fragment>
                ))}
            </FormGroup>
        </FormGroup>
    )
}

const LogRow = ({ text}: { text: string }) => {
    return (
        <span style={{ color: getColor(text) }}>
            {text}
        </span>
    )
}

const entryColors: Record<string, string[]> = {
    red: ['ERROR'],
    orange: ['WARNING'],
    lightskyblue: ['INFO'],
    khaki: ['Started', 'Stopped'],
    grey: ['During handling of the above exception, another exception occurred'],
    darkgray: ['  File '],
}

const getColor = (text: string): string | undefined => {
    for (const color in entryColors) {
        for (const entry of entryColors[color]) {
            if (text.includes(entry)) {
                return color;
            }
        }
    }

    return undefined;
}

export default Logs;