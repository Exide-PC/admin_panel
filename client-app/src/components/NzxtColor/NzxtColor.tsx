import _ from "lodash";
import { toast } from "react-hot-toast";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { RadioButton } from "../common/RadioButton";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { AppDispatch } from "../../app/store";
import { nzxtActions, useNzxtConfig } from "../../features/nzxt/nzxt-logic";
import { NzxtConfig } from "../../features/nzxt/nzxt-slice";

// https://github.com/liquidctl/liquidctl/blob/main/docs/nzxt-hue2-guide.md
const colorMeta = {
    'off': { min: 0, max: 0 },
    'fixed': { min: 1, max: 1 },
    'fading': { min: 2, max: 8 },
    'spectrum-wave': { min: 0, max: 0 },
    'rainbow-flow': { min: 0, max: 0 },
    'super-rainbow': { min: 0, max: 0 },
    'rainbow-pulse': { min: 0, max: 0 },
    'candle': { min: 1, max: 1 },
    'starry-night': { min: 1, max: 1 },
    // 'wings': { min: 1, max: 1 }, // does not work, throwing "IndexError: list assignment index out of range"
    'covering-marquee': { min: 1, max: 8 },
    'pulse': { min: 1, max: 8 },
    'breathing': { min: 1, max: 8 },
    'super-fixed': { min: 1, max: 40 },
    'super-breathing': { min: 1, max: 40 },
    'marquee': { min: 1, max: 1, hasLength: true },
    'alternating': { min: 2, max: 2, hasLength: true },
    'moving-alternating': { min: 2, max: 2, hasLength: true },
} as const;

type ColorMeta = typeof colorMeta;
type ColorType = keyof ColorMeta;
type AnyColor = ColorMapped[ColorType]

const colorTypes = Object.keys(colorMeta) as ColorType[];

type ColorMapped = {
    [P in keyof ColorMeta]: {
        type: P,
        colors: string[];
    } & (
        ColorMeta[P] extends { hasLength: true }
        ? { length: number }
        : {}
    )
}

// https://javascript.plainenglish.io/typescript-essentials-conditionally-filter-types-488705bfbf56
type FilterConditionally<Source, Condition> = Pick<Source, {[K in keyof Source]: Source[K] extends Condition ? K : never}[keyof Source]>;

type LengthedColorType = keyof FilterConditionally<ColorMeta, { hasLength: true }>
type LengthDiscriminator = Partial<Pick<ColorMeta[LengthedColorType], 'hasLength'>>

function hasLength(type: ColorType): type is LengthedColorType;
function hasLength(color: AnyColor): color is ColorMapped[LengthedColorType]
function hasLength(arg: ColorType | AnyColor) {
    const meta = typeof arg === 'string'
        ? colorMeta[arg]
        : colorMeta[arg.type];

    return !!(meta as LengthDiscriminator).hasLength
}

type Modifiers = {
    speed: 'slowest' | 'slower' | 'normal' | 'faster' | 'fastest';
    direction: 'forward' | 'backward';
}

const defaultColor = '#d600ff';

interface NzxtColorEditorProps {
    initConfig: NzxtConfig;
    initColor: AnyColor;
    initModifiers: Modifiers;
}

const NzxtColorEditor = ({ initConfig, initColor, initModifiers }: NzxtColorEditorProps) => {

    const dispatch = useAppDispatch();

    const [config, setConfig] = useState(initConfig);
    const [color, setColor] = useState<AnyColor>(initColor);
    const [modifiers, setModifiers] = useState<Modifiers>(initModifiers)
    const [saveToDb, setSaveToDb] = useState<boolean>(true);
    const [anyChanges, setAnyChanges] = useState<boolean>(false)

    useEffect(() => {
        if (!anyChanges) return;

        const args = `${convertColor(color)} ${convertModifiers(modifiers)}`;
        const newConfig: NzxtConfig = { ...config, color_args: args };

        const debounce = _.debounce(() => submitColor(newConfig, saveToDb, dispatch), 200);
        debounce();

        return debounce.cancel;
    }, [color, modifiers, config, saveToDb, anyChanges]);

    const handleModifiers = (v: Modifiers) => {
        setModifiers(v);
        setAnyChanges(true);
    }

    const handleColorType = (type: AnyColor['type']) => {
        const count = colorMeta[type].max;
        const colors: string[] = initColors(count);

        if (!hasLength(type)) {
            setColor({
                type: type,
                colors: colors,
            });
        }
        else {
            setColor({
                type: type,
                colors: colors,
                length: 3,
            });
        }

        setAnyChanges(true);
    }

    const handleColorAt = (index: number, v: string) => {
        setColor(prev => ({
            ...prev,
            colors: prev.colors.map((c, i) => i !== index ? c : v),
        }));

        setAnyChanges(true);
    }

    const handleLength = (length: number) => {
        setColor(prev => {
            if (!hasLength(prev))
                return prev;

            return {
                type: prev.type,
                colors: prev.colors,
                length: length
            }
        })
        setAnyChanges(true);
    }

    const handleColorCount = (count: number) => {
        setColor(prev => {
            const prevColors = prev.colors;

            const newColors = count < prevColors.length
                ? prevColors.slice(0, count)
                : [...prevColors, ...initColors(count - prevColors.length)]

            return ({
                ...prev,
                colors: newColors,
            })
        });
    }

    const handleSaveToDb = (v: boolean) => {
        setSaveToDb(v);
        setAnyChanges(true);
    }

    const handleNightStart = (v: number) => {
         setConfig(prev => ({ ...prev, night_hours_start: v }))
         setAnyChanges(true);
    }

    const handleNightEnd = (v: number) => {
         setConfig(prev => ({ ...prev, night_hours_end: v }))
         setAnyChanges(true);
    }

    const colorCount = colorMeta[color.type];
    const showCountInput = colorCount.min !== colorCount.max;

    return (
        <div>
            <FormGroup>
                <FormGroup>
                    <FormGroup check>
                        <Input
                            type="checkbox"
                            checked={saveToDb}
                            onChange={e => handleSaveToDb(e.target.checked)}
                        />
                        {' '}
                        <Label check>
                            Save to database
                        </Label>
                    </FormGroup>
                </FormGroup>
                <FormGroup style={{ width: 300 }}>
                    <Row>
                        <Col>
                            <Input type="number" value={config.night_hours_start} onChange={e => handleNightStart(e.target.valueAsNumber)}/>
                        </Col>
                        <Col>
                            <Input type="number" value={config.night_hours_end} onChange={e => handleNightEnd(e.target.valueAsNumber)}/>
                        </Col>
                    </Row>
                </FormGroup>
                <Row>
                    <Col xs={12} md={4}>
                        {colorTypes.map(t => (
                            <RadioButton
                                key={t}
                                label={getColorTypeLabel(t)}
                                checked={color.type === t}
                                onClick={() => handleColorType(t)}
                            />
                        ))}
                    </Col>
                    <Col xs={6} md={4}>
                        <RadioButton
                            label="Slowest"
                            checked={modifiers.speed === 'slowest'}
                            onClick={() => handleModifiers({ ...modifiers, speed: 'slowest' })}
                        />
                        <RadioButton
                            label="Slower"
                            checked={modifiers.speed === 'slower'}
                            onClick={() => handleModifiers({ ...modifiers, speed: 'slower' })}
                        />
                        <RadioButton
                            label="Normal"
                            checked={modifiers.speed === 'normal'}
                            onClick={() => handleModifiers({ ...modifiers, speed: 'normal' })}
                        />
                        <RadioButton
                            label="Faster"
                            checked={modifiers.speed === 'faster'}
                            onClick={() => handleModifiers({ ...modifiers, speed: 'faster' })}
                        />
                        <RadioButton
                            label="Fastest"
                            checked={modifiers.speed === 'fastest'}
                            onClick={() => handleModifiers({ ...modifiers, speed: 'fastest' })}
                        />
                    </Col>
                    <Col xs={6} md={4}>
                        <RadioButton
                            label="Forward"
                            checked={modifiers.direction === 'forward'}
                            onClick={() => handleModifiers({ ...modifiers, direction: 'forward' })}
                        />
                        <RadioButton
                            label="Backward"
                            checked={modifiers.direction === 'backward'}
                            onClick={() => handleModifiers({ ...modifiers, direction: 'backward' })}
                        />
                    </Col>
                </Row>
            </FormGroup>
            <FormGroup>
                {showCountInput && (
                    <FormGroup>
                        Color count:
                        <Input
                            type="number"
                            value={color.colors.length}
                            onChange={e => handleColorCount(e.target.valueAsNumber)}
                            min={colorCount.min}
                            max={colorCount.max}
                        />
                    </FormGroup>
                )}
                {hasLength(color) && (
                    <FormGroup>
                        Length:
                        <Input
                            type="number"
                            value={color.length}
                            onChange={e => handleLength(e.target.valueAsNumber)}
                            min={3}
                            max={6}
                        />
                    </FormGroup>
                )}
            </FormGroup>
            <FormGroup style={{ width: 300 }}>
                {color.colors.map((c, i) => (
                    <Input
                        key={i}
                        type="color"
                        value={c}
                        onChange={e => handleColorAt(i, e.target.value)}
                    />
                ))}
            </FormGroup>
        </div>
    )
}

const convertColor = (color: AnyColor): string => {
    if (hasLength(color)) {
        return `${color.type}-${color.length} ${color.colors.map(c => c.substring(1)).join(' ')}`
    }
    else {
        return `${color.type} ${color.colors.map(c => c.substring(1)).join(' ')}`
    }
}

const convertModifiers = (modifiers: Modifiers) => {
    return `--speed ${modifiers.speed} --direction ${modifiers.direction}`
}

const submitColor = async (config: NzxtConfig, saveToDb: boolean, dispatch: AppDispatch) => {
    await toast.promise(
        dispatch(nzxtActions.updateNzxtConfig(config, saveToDb)), {
            loading: `Saving...`,
            success: `Saved`,
            error: `Failed to save`,
        }
    );
}

const initColors = (count: number) => {
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
        result.push(defaultColor);
    }

    return result;
}

const getColorTypeLabel = (type: ColorType): JSX.Element | string => {
    const meta = colorMeta[type];

    if (meta.min === 0 && meta.max === 0) {
        return type;
    }

    return <>{type} <small style={{ color: 'gray' }}>(min: {meta.min}, max: {meta.max})</small></>
}

const parseColor = (args: string): [AnyColor, Modifiers] => {
    const parts = args.split(' ').filter(p => !!p);

    const color: any = {};
    const modifiers: any = {}

    color.colors = parts.slice(1, -4).map(c => `#${c}`);

    if (/^.*-[3-6]$/.test(parts[0])) {
        const typeParts = parts[0].split('-');
        color.type = typeParts.slice(0, -1).join('-')
        color.length = parseInt(typeParts.slice(-1)[0])
    }
    else {
        color.type = parts[0];
    }

    modifiers.speed = parts.slice(-3)[0]
    modifiers.direction = parts.slice(-1)[0]

    return [color, modifiers];
}

const NzxtColorPage = () => {

    const [currentConfig, configs, isLoaded] = useNzxtConfig();

    if (!isLoaded || !currentConfig) {
        return <></> // loading
    }

    const [initColor, initModifiers] = parseColor(currentConfig.color_args);

    return (
        <NzxtColorEditor
            initConfig={currentConfig}
            initColor={initColor}
            initModifiers={initModifiers}
        />
    )
}

export default NzxtColorPage;