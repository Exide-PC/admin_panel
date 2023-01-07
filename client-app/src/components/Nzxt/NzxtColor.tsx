import _ from "lodash";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import { RadioButton } from "../common/RadioButton";
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

interface NzxtColorProps {
    config: NzxtConfig;
    onChange: (c: NzxtConfig) => void;
}

const NzxtColor = ({ config, onChange }: NzxtColorProps) => {

    const [color, modifiers] = parseColor(config.color_args);

    const handleColor = (v: AnyColor) => {
        const args = formatColorArgs(v, modifiers);
        const newConfig: NzxtConfig = { ...config, color_args: args };
        onChange(newConfig);
    }

    const handleModifiers = (v: Modifiers) => {
        const args = formatColorArgs(color, v);
        const newConfig: NzxtConfig = { ...config, color_args: args };
        onChange(newConfig);
    }

    const handleColorType = (type: AnyColor['type']) => {
        const count = colorMeta[type].max;
        const colors: string[] = initColors(count);

        if (!hasLength(type)) {
            handleColor({
                type: type,
                colors: colors,
            });
        }
        else {
            handleColor({
                type: type,
                colors: colors,
                length: 3,
            });
        }
    }

    const handleColorAt = (index: number, v: string) => {
        handleColor({
            ...color,
            colors: color.colors.map((c, i) => i !== index ? c : v),
        })
    }

    const handleLength = (length: number) => {
        if (!hasLength(color))
            return;

        handleColor({
            ...color,
            type: color.type,
            colors: color.colors,
            length: length
        })
    }

    const handleColorCount = (count: number) => {
        const prevColors = color.colors;

        const newColors = count < prevColors.length
            ? prevColors.slice(0, count)
            : [...prevColors, ...initColors(count - prevColors.length)]

        handleColor({
            ...color,
            colors: newColors,
        })
    }

    const handleNightStart = (v: number) => {
        onChange({ ...config, night_hours_start: coerceHour(v) })
    }

    const handleNightEnd = (v: number) => {
        onChange({ ...config, night_hours_end: coerceHour(v) })
    }

    const colorCount = colorMeta[color.type];
    const showCountInput = colorCount.min !== colorCount.max;

    return (
        <FormGroup>
            <FormGroup style={{ width: 200 }}>
                <Label>Night Hours</Label>
                <FormGroup row>
                    <Col>
                        <Input type="number" value={config.night_hours_start} onChange={e => handleNightStart(e.target.valueAsNumber)}/>
                    </Col>
                    <Col>
                        <Input type="number" value={config.night_hours_end} onChange={e => handleNightEnd(e.target.valueAsNumber)}/>
                    </Col>
                </FormGroup>
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
        </FormGroup>
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

const formatColorArgs = (color: AnyColor, modifiers: Modifiers) => {
    return `${convertColor(color)} ${convertModifiers(modifiers)}`;
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

const coerceHour = (v: number) => {
    return (
        v < 0 ? 23 :
        v > 23 ? 0 :
        v
    )
}

export default NzxtColor;