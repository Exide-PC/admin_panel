import * as React from "react";
import { useNzxtConfig } from "../../features/nzxt/nzxt-logic";
import NzxtColor from "./NzxtColor";

interface Props {
}

const NzxtPage = ({  }: Props) => {
    const [currentConfig, configs, isLoaded] = useNzxtConfig();

    if (!isLoaded || !currentConfig || !currentConfig) {
        return <></> // loading
    }

    return (
        <NzxtColor
            configs={configs}
            activeConfig={currentConfig}
        />
    )
}

export default NzxtPage;