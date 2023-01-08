import * as React from "react";
import { useState } from "react";
import { DropdownItem, DropdownMenu, DropdownToggle, FormGroup, UncontrolledDropdown } from "reactstrap";
import { fetchJournalLogs } from "../../features/maintenance/maintenance-api";
import { useJournals } from "../../features/maintenance/maintenance-logic";
import { Journal } from "../../features/maintenance/maintenance-slice";

interface Props {
}

const Logs = ({  }: Props) => {

    const [selectedJournal, setSelectedJournal] = useState<Journal | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    
    const [journals] = useJournals();

    const handleJournal = async (j: Journal) => {
        setSelectedJournal(j);

        const result = await fetchJournalLogs(j.id);
        setLogs(result);
    }
    
    return (
        <FormGroup>
            <FormGroup>
                <UncontrolledDropdown>
                    <DropdownToggle caret>
                        {selectedJournal?.name ?? '<Select>'}
                    </DropdownToggle>
                    <DropdownMenu dark>
                        {journals.map(j => (
                            <DropdownItem key={j.id} onClick={() => handleJournal(j)}>
                                {j.name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </FormGroup>
            <FormGroup>
                {logs.map((l, i) => (
                    <React.Fragment key={i}>
                        {l}<br/>
                    </React.Fragment>
                ))}
            </FormGroup>
        </FormGroup>
    )
}

export default Logs;