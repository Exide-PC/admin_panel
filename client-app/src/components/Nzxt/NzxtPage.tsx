import * as React from "react";
import { useMemo, useRef, useState } from "react";
import _ from "lodash";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { nzxtActions, useNzxtConfig, useNzxtStatus } from "../../features/nzxt/nzxt-logic";
import { NzxtConfig, NzxtStatus } from "../../features/nzxt/nzxt-slice";
import NzxtColor, { formatColorArgs } from "./NzxtColor";
import { Button, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, InputGroup, UncontrolledDropdown } from "reactstrap";
import { uuid4 } from "../../utils/uuid64";

interface Props {
    configs: NzxtConfig[];
    initialConfig: NzxtConfig;
    status: NzxtStatus;
}   

const NzxtPage = ({ configs, initialConfig, status }: Props) => {
    const dispatch = useAppDispatch();
    
    const [configPreview, setConfigPreview] = useState<NzxtConfig>(initialConfig);
    const [isNameEdit, setIsNameEdit] = useState<boolean>(false);

    const debounceRef = useRef<_.DebouncedFunc<() => Promise<void>>>();

    const handleChange = (newConfig: NzxtConfig) => {
        debounceRef.current?.cancel(); // resetting previous if any

        debounceRef.current = _.debounce(() => submitColor(newConfig, dispatch), 200);
        debounceRef.current();

        setConfigPreview(newConfig);
    }

    const handlePart = (part: Partial<NzxtConfig>) => {
        handleChange({ ...configPreview, ...part })
    }

    const handleAdd = async () => {
        const newConfig: NzxtConfig = {
            id: uuid4(),
            name: `Config ${configs.length + 1}`,
            color_args: formatColorArgs({
                type: 'off',
                colors: [],
            }, {
                speed: 'slowest',
                direction: 'forward',
            }),
            night_hours_start: 0,
            night_hours_end: 0,
            fan_speed: 50,
        }
        await dispatch(nzxtActions.createNzxtConfig(newConfig));
        setConfigPreview(newConfig);
    }

    const handleDelete = async () => {
        if (configs.length >= 2) {
            await dispatch(nzxtActions.deleteNzxtConfig(configPreview));
        }
    }

    return (
        <FormGroup>
            <h3>
                Temp: {status.cpu_temperature}
            </h3>
            <FormGroup style={{ display: 'flex' }}>
                <InputGroup>
                    {!isNameEdit &&
                        <UncontrolledDropdown>
                            <DropdownToggle caret>
                                {configPreview.name}
                            </DropdownToggle>
                            <DropdownMenu dark>
                                {configs.map((c, i) => (
                                    <DropdownItem key={c.id} onClick={() => handleChange(c)}>
                                        {c.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    }
                    {isNameEdit &&
                        <Input
                            style={{ maxWidth: 150 }}
                            type="text"
                            value={configPreview.name}
                            onChange={e => handlePart({ name: e.target.value })}
                        />
                    }
                    <Button outline onClick={handleAdd}>
                        Add
                    </Button>
                    <Button outline onClick={handleDelete} disabled={configs.length < 2}>
                        Delete
                    </Button>
                    <Button outline onClick={() => setIsNameEdit(prev => !prev)} disabled={configs.length < 2}>
                        {!isNameEdit ? 'Rename' : 'Submit'}
                    </Button>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <NzxtColor
                    config={configPreview}
                    onChange={handlePart}
                />
            </FormGroup>
        </FormGroup>
    )
}

const submitColor = async (config: NzxtConfig, dispatch: AppDispatch) => {
    await toast.promise(
        dispatch(nzxtActions.updateNzxtConfig(config)), {
            loading: `Saving...`,
            success: `Saved`,
            error: `Failed to save`,
        }
    );
}

const NzxtPageWrapper = () => {

    const [currentConfig, configs, isConfigLoaded] = useNzxtConfig();
    const [status, isStatusLoaded] = useNzxtStatus();

    // remounting component when current id changes due to new one being added or current deleted
    // and to also wipe inner state of currently pending to save config
    const key = useMemo(uuid4, [currentConfig?.id]);

    if (!isConfigLoaded || !currentConfig || !isStatusLoaded) {
        return <></> // loading
    }

    return (
        <NzxtPage
            key={key}
            configs={configs}
            initialConfig={currentConfig}
            status={status}
        />
    )
}

export default NzxtPageWrapper;