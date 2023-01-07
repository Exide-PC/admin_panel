import * as React from "react";
import { useRef, useState } from "react";
import _ from "lodash";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { nzxtActions, useNzxtConfig } from "../../features/nzxt/nzxt-logic";
import { NzxtConfig } from "../../features/nzxt/nzxt-slice";
import NzxtColor from "./NzxtColor";
import { DropdownItem, DropdownMenu, DropdownToggle, FormGroup, UncontrolledDropdown } from "reactstrap";

interface Props {
    configs: NzxtConfig[];
    initialConfig: NzxtConfig;
}   

const NzxtPage = ({ configs, initialConfig }: Props) => {
    const dispatch = useAppDispatch();
    
    const [config, setConfig] = useState<NzxtConfig>(initialConfig);

    const debounceRef = useRef<_.DebouncedFunc<() => Promise<void>>>();

    const handleChange = (newConfig: NzxtConfig) => {
        debounceRef.current?.cancel(); // resetting previous if any

        debounceRef.current = _.debounce(() => submitColor(newConfig, dispatch), 200);
        debounceRef.current();

        setConfig(newConfig);
    }

    return (
        <FormGroup>
            <FormGroup>
                <UncontrolledDropdown>
                    <DropdownToggle caret>
                        Mode {configs.findIndex(c => c.id === config.id) + 1}
                    </DropdownToggle>
                    <DropdownMenu dark>
                        {configs.map((c, i) => (
                            <DropdownItem key={c.id} onClick={() => handleChange(c)}>
                                Mode {i + 1}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </UncontrolledDropdown>
            </FormGroup>
            <FormGroup>
                <NzxtColor
                    config={config}
                    onChange={handleChange}
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

    const [currentConfig, configs, isLoaded] = useNzxtConfig();

    if (!isLoaded || !currentConfig || !currentConfig) {
        return <></> // loading
    }

    return (
        <NzxtPage
            configs={configs}
            initialConfig={currentConfig}
        />
    )
}

export default NzxtPageWrapper;