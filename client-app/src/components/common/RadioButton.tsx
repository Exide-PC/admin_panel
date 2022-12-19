import { FormGroup, Input, Label } from "reactstrap";

export const RadioButton = ({ label, checked, onClick }: { label: string | JSX.Element; checked: boolean; onClick: () => void; }) => {
    return (
        <FormGroup check>
            <Input type="radio" checked={checked} onChange={onClick}/>
            <Label check>
                {label}
            </Label>
        </FormGroup>
    )
}