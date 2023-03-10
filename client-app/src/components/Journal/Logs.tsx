import * as React from "react";
import { useRef, useState } from "react";
import _ from "lodash";
import { DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, UncontrolledDropdown } from "reactstrap";
import { fetchJournalLogs } from "../../features/maintenance/maintenance-api";
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
    
    const [journals] = useJournals();

    const debounce = useDebounce();

    const handleChange = (j: Journal | null, c: number) => {
        setSelectedJournal(j);
        setCount(c);

        if (!j) return;

        debounce(async () => {
            setLoading(true);
            const result = await fetchJournalLogs(j.id, c);
            setLogs(result);
            setLoading(false);
        })
    }
    
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
                                <DropdownItem key={j.id} onClick={() => handleChange(j, count)}>
                                    {j.name}
                                </DropdownItem>
                            ))}
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <Input
                        style={{ maxWidth: 110, minWidth: 110 }}
                        type='number'
                        value={count}
                        onChange={e => handleChange(selectedJournal, e.target.valueAsNumber)}
                        placeholder='Count'
                    />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                {logs.map((l, i) => (
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
    red: ['exception', 'error'],
    orange: ['warning'],
    yellow: ['start', 'stop']
}

const getColor = (text: string): string | undefined => {
    const textLower = text.toLowerCase();

    for (const color in entryColors) {
        for (const entry of entryColors[color]) {
            if (textLower.includes(entry)) {
                return color;
            }
        }
    }

    return undefined;
}

export default Logs;