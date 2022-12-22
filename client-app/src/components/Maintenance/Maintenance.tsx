import * as React from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Button, Row } from "reactstrap";
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

    return (
        <Row>
            {commands.map((c, i) => (
                <Button block onClick={() => maintenance(i)}>
                    {c.name}
                </Button>
            ))}
        </Row>
    )
}

export default Maintenance;