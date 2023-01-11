import _ from "lodash";
import * as React from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button, FormGroup, InputGroup, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { maintenanceActions } from "../../features/maintenance/maintenance-logic";
import { getMaintenanceCommands } from "../../features/maintenance/maintenance-selectors";
import { MaintenanceCommand } from "../../features/maintenance/maintenance-slice";

const Maintenance = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(maintenanceActions.loadMaintenanceCommands());
    }, [dispatch]);

    const commands = useAppSelector(getMaintenanceCommands);

    const maintenance = async (command: MaintenanceCommand) => {
        await toast.promise(
            dispatch(maintenanceActions.executeMaintenanceCommand(command.id)), {
                loading: `${command.group}: ${command.name}...`,
                success: `${command.group}: ${command.name}`,
                error: `${command.group} ${command.name}`,
            }
        )
    }

    const groups = React.useMemo(() => {
        return _.groupBy(commands, 'group')
    }, [commands]);

    return (
        <Row>
            {Object.keys(groups).map(group => (
                <FormGroup key={group}>
                    <big>{group}</big>
                    <br/>
                    <InputGroup>
                        {groups[group].map((c, i) => (
                            <Button key={i} onClick={() => maintenance(c)} outline>
                                {c.name}
                            </Button>
                        ))}
                    </InputGroup>
                </FormGroup>
            ))}
        </Row>
    )
}

export default Maintenance;