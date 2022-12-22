import _ from "lodash";
import * as React from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button, FormGroup, Row } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { maintenanceActions } from "../../features/maintenance/maintenance-logic";
import { getMaintenanceCommands } from "../../features/maintenance/maintenance-selectors";

const Maintenance = () => {

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(maintenanceActions.loadMaintenanceCommands());
    }, [dispatch]);

    const commands = useAppSelector(getMaintenanceCommands);

    const maintenance = async (index: number) => {
        await toast.promise(
            dispatch(maintenanceActions.executeMaintenanceCommand(index)), {
                loading: `${commands[index].name}...`,
                success: `${commands[index].name}`,
                error: `Failed to ${commands[index].name}`,
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
                    {groups[group].map((c, i) => (
                        <Button block key={i} onClick={() => maintenance(i)}>
                            {c.name}
                        </Button>
                    ))}
                </FormGroup>
            ))}
        </Row>
    )
}

export default Maintenance;