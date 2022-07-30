import { Expression } from "./Expression";
import { Complex } from "./maths/Complex";

//#region graph opts
/** Graph.opts interface */
interface IOpts {
    /** Pixel gap between x markers */
    xstepGap: number;
    /** What is the x-step interval */
    xstep: number;
    /** Function taking current step and returning the label */
    xstepLabel: ((n: number) => string) | undefined;
    /** leftmost X value */
    xstart: number;
    markXAxis: boolean;

    /** Pixel gap between y markers */
    ystepGap: number;
    /** What is the y-step interval */
    ystep: number;
    /** Function taking current step and returning the label */
    ystepLabel: ((n: number) => string) | undefined;
    /** topmost Y value */
    ystart: number;
    markYAxis: boolean;

    /** Show the grid lines? */
    grid: boolean;
    /** Thickness (px) of main axis lines */
    axisThickness: number;
    /** Decimal places of axis labels */
    labelPrecision: number;
    /** Thickness (px) of grid lines */
    gridThickness: number;
    /** Width (px) of each function line */
    lineWidth: number;
    /** How many divisions between main grid lines? */
    subGridDivs: number;
    /** Generate <ncoord> coordinates per line */
    ncoords: number;

    /** Variable symbol for LineType.Parametric */
    parametricVar: string;
    /** Variable symbol for LineType.Polar */
    polarVar: string;
}

/** IOpts where each property is optional */
interface IOptsOptional {
    xstepGap?: number;
    xstep?: number;
    xstepLabel?: ((n: number) => string) | undefined;
    xstart?: number;
    markXAxis?: boolean;
    ystepGap?: number;
    ystep?: number;
    ystepLabel?: ((n: number) => string) | undefined;
    ystart?: number;
    markYAxis?: boolean;
    grid?: boolean;
    axisThickness?: number;
    labelPrecision?: number;
    gridThickness?: number;
    lineWidth?: number;
    subGridDivs?: number;
    ncoords?: number;
    parametricVar?: string;
    polarVar?: string;
}

/** Populates IOptsOptional to IOpts. Returns new object. */
export function populateOpts(opts: IOptsOptional) {
    return {
        xstepGap: opts.xstepGap ?? 100,
        xstep: opts.xstep ?? 2,
        xstepLabel: opts.ystepLabel ?? undefined,
        xstart: opts.xstart ?? -10,
        markXAxis: opts.markXAxis ?? true,
        ystepGap: opts.ystepGap ?? 100,
        ystep: opts.ystep ?? 2,
        ystepLabel: opts.ystepLabel ?? undefined,
        ystart: opts.ystart ?? 8,
        markYAxis: opts.markYAxis ?? true,
        grid: opts.grid ?? true,
        axisThickness: opts.axisThickness ?? 1,
        labelPrecision: opts.labelPrecision ?? 2,
        gridThickness: opts.gridThickness ?? 0.3,
        lineWidth: opts.lineWidth ?? 2,
        subGridDivs: opts.subGridDivs ?? 4,
        ncoords: opts.ncoords ?? 5000,
        parametricVar: opts.parametricVar ?? "t",
        polarVar: opts.polarVar ?? "a",
    } as IOpts;
}
//#endregion

//#region line types
/** Line Types */
export enum LineType {
    Addition,       // ILineAddition
    Antiderivative, // ILineAntiderivative
    ComplexField,   // ILineComplexField
    ComplexIm,      // ILineComplexIm
    ComplexImSep,   // ILineComplexImSep
    ComplexRe,      // ILineComplexRe
    ComplexReSep,   // ILineComplexReSep
    Coords,         // ILineCoords
    Derivative,     // ILineDerivative
    Division,       // ILineDivision
    Multiplication, // ILineMultiplication
    Parametric,     // ILineParametric
    Polar,          // ILinePolar
    Subtraction,    // ILineSubtraction
    TaylorApprox,   // ILineTaylorApprox
    Translate,      // ILineTranslate
    X,              // ILineX
    Y,              // ILineY
}

/** Line interface */
export interface ILine {
    /** Did an error occur on latest draing attempt? */
    error: boolean;
    /** If error === true, this contains the error message */
    emsg?: string | undefined;
    /** Color of the line */
    color: string;
    /** Dasharray of the line */
    dasharray?: number[];
    /** Width of the line (default: graph.opts.lineWidth) */
    lineWidth?: number;
    /** Shade area? */
    shade?: "" | "gt" | "ge" | "lt" | "le";
    /** Join co-ordinates? (default=true) */
    join?: boolean;
}

/** Add two lines together */
export interface ILineAddition extends ILine {
    type: LineType.Addition;
    /** IDs of lines to add */
    ids: number[];
    coords: number[][];
}

/**
 * Return addition line
 * @param ids IDs of lines to add together
 * @param color color of line (default=black)
 */
export function createAdditionLine(ids: number[], color = '#000000') {
    return {
        type: LineType.Addition,
        ids,
        color,
    } as ILineAddition;
}

/** Complex: given (re, im) of input, plot (re, out) of output using complex domain coloring */
export interface ILineComplexField extends ILine {
    type: LineType.ComplexField;
    /** Expression: input `z: Complex`, outputs: `z*, Complex` */
    expr: Expression;
    /** [in_complex, out_complex] */
    coords: Complex[][];
}

/**
 * Return complex line: vary complex inout, plot complex output
 * @param expr Expression Complex -> Complex (must be serup to handle complex maths)
 */
export function createComplexFieldLine(expr: Expression) {
    return {
        type: LineType.ComplexField,
        expr,
    } as ILineComplexField;
}

/** Complex: varying the real component, plot (re, im) */
export interface ILineComplexRe extends ILine {
    type: LineType.ComplexRe;
    /** Expression: input `z: Complex`, outputs: `z*, Complex` */
    expr: Expression;
    /** Imaginary component of input */
    imag: number;
    /** [out_re, out_imag] */
    coords: number[][];
}

/**
 * Return complex line: vary real component, fixed imaginary component, plot (re, im) of output
 * @param expr Expression Complex -> Complex (must be serup to handle complex maths)
 * @param imag Imaginary component of input (real component is varied)
 * @param color color of line (default=black)
 */
export function createComplexReLine(expr: Expression, imag = 0, color = '#000000') {
    return {
        type: LineType.ComplexRe,
        expr,
        imag,
        color,
    } as ILineComplexRe;
}

/** Complex: varying the real component, plot both real and imaginary parts */
export interface ILineComplexReSep extends ILine {
    type: LineType.ComplexReSep;
    /** Expression: input `z: Complex`, outputs: `z*, Complex` */
    expr: Expression;
    /** Imaginary component of input */
    imag: number;
    /** [in_re, out_re, out_imag] */
    coords: number[][];
    /** Color of real component (default=this.color) */
    colorReal?: string;
    /** Color of imaginary component (default=this.color) */
    colorImag?: string;
}

/**
 * Return complex line: vary real component, fixed imaginary component, plot output components seperatly
 * @param expr Expression Complex -> Complex (must be serup to handle complex maths)
 * @param imag Imaginary component of input (real component is varied)
 * @param colorReal color of line of real component (default=red)
 * @param colorImag color of line of complex component (default=blue)
 */
export function createComplexReSepLine(expr: Expression, imag = 0, colorReal = '#FF0000', colorImag = '#0000FF') {
    return {
        type: LineType.ComplexReSep,
        expr,
        imag,
        colorReal, colorImag,
    } as ILineComplexReSep;
}

/** Complex: varying the imaginary component, plot (re, im) */
export interface ILineComplexIm extends ILine {
    type: LineType.ComplexIm;
    /** Expression: input `z: Complex`, outputs: `z*, Complex` */
    expr: Expression;
    /** Real component of input */
    real: number;
    /** [out_re, out_imag] */
    coords: number[][];
}

/**
 * Return complex line: vary imaginary component, fixed real component, plot (re, im) of output
 * @param expr Expression Complex -> Complex (must be serup to handle complex maths)
 * @param real Real component of input (imaginary component is varied)
 * @param color color of line (default=black)
 */
export function createComplexImLine(expr: Expression, real = 0, color = '#000000') {
    return {
        type: LineType.ComplexIm,
        expr,
        real,
        color,
    } as ILineComplexIm;
}

/** Complex: varying the imaginary component, plot both real and imaginary parts */
export interface ILineComplexImSep extends ILine {
    type: LineType.ComplexImSep;
    /** Expression: input `z: Complex`, outputs: `z*, Complex` */
    expr: Expression;
    /** Real component of input */
    real: number;
    /** [in_im, out_re, out_imag] */
    coords: number[][];
    /** Color of real component (default=this.color) */
    colorReal?: string;
    /** Color of imaginary component (default=this.color) */
    colorImag?: string;
}

/**
 * Return complex line: vary imaginary component, fixed real component, plot output components seperatly
 * @param expr Expression Complex -> Complex (must be serup to handle complex maths)
 * @param real Real component of input (imaginary component is varied)
 * @param colorReal color of line of real component (default=red)
 * @param colorImag color of line of complex component (default=blue)
 */
export function createComplexImSepLine(expr: Expression, real = 0, colorReal = '#FF0000', colorImag = '#0000FF') {
    return {
        type: LineType.ComplexImSep,
        expr,
        real,
        colorReal, colorImag,
    } as ILineComplexImSep;
}

/** Plot only co-ordinates */
export interface ILineCoords extends ILine {
    type: LineType.Coords;
    coords: number[][];
}

/**
 * Create line type which only draw co-ordinate points
 * @param coords co-ordinates to draw
 * @param color line color (default=black)
 */
export function createLineCoords(coords: number[][], color = "#000000") {
    return {
        type: LineType.Coords,
        error: false,
        join: false,
        color,
        coords,
    } as ILineCoords;
}

/** Antiderivative of another line */
export interface ILineAntiderivative extends ILine {
    type: LineType.Antiderivative,
    /** ID of line to take antiderivative of */
    id: number;
    /** Constant of integration */
    C: number;
    /** Generated co-ordinates */
    coords?: number[][];
}

/**
 * Create new line which is the antiderivative of another
 * @param id ID of line to take the antiderivative of
 * @param C Constant of integration (default=0)
 * @param color color of line (Default=black)
 */
export function createAntiderivativeLine(id: number, C = 0, color = '#000000') {
    return {
        type: LineType.Antiderivative,
        error: false,
        id, C,
        color,
    } as ILineAntiderivative;
}

/** Derivative of another line */
export interface ILineDerivative extends ILine {
    type: LineType.Derivative,
    /** ID of line to take derivative of */
    id: number;
    /** Generated co-ordinates */
    coords?: number[][];
}

/**
 * Create new line which is the derivative of another
 * @param id ID of line to take derivative of
 * @param color color of line (Default=black)
 */
export function createDerivativeLine(id: number, color = '#000000') {
    return {
        type: LineType.Derivative,
        error: false,
        id,
        color,
    } as ILineDerivative;
}

/** Divide several lines from eachother: ids[0] / ids[1] / ... */
export interface ILineDivision extends ILine {
    type: LineType.Division;
    /** IDs of lines to divide */
    ids: number[];
    coords: number[][];
}

/**
 * Return division line
 * @param ids IDs of lines to divide: ids[0] / ids[1] / ...
 * @param color color of line (default=black)
 */
export function createDivisionLine(ids: number[], color = '#000000') {
    return {
        type: LineType.Division,
        ids,
        color,
    } as ILineDivision;
}

/** Multiply several lines together */
export interface ILineMultiplication extends ILine {
    type: LineType.Multiplication;
    /** IDs of lines to multiply */
    ids: number[];
    coords: number[][];
}

/**
 * Return multiplication line
 * @param ids IDs of lines to multiply together: ids[0] * ids[1] * ...
 * @param color color of line (default=black)
 */
export function createMultiplicationLine(ids: number[], color = '#000000') {
    return {
        type: LineType.Multiplication,
        ids,
        color,
    } as ILineMultiplication;
}

/** Parametric line */
export interface ILineParametric extends ILine {
    type: LineType.Parametric;
    /** Range of parameter (inclusive): [start, end, ?step] */
    range: number[];
    /** Expression: take `p: number`, returns `x: number` */
    exprx: Expression;
    /** Expression: take `p: number`, returns `y: number` */
    expry: Expression;
    /** Generated co-ordinates */
    coords?: number[][];
}

/**
 * Create new parametric line
 * @param exprx Expression takes `p: number` returns `x: number`
 * @param expry Expression takes `p: number` returns `y: number`
 * @param range range of parameter p [start, end, ?step] (inclusive)
 * @param color color of line (Default=black)
 */
export function createParametricLine(exprx: Expression, expry: Expression, range: number[], color = '#000000') {
    return {
        type: LineType.Parametric,
        error: false,
        exprx, expry,
        range,
        color,
    } as ILineParametric;
}

/** Polar line */
export interface ILinePolar extends ILine {
    type: LineType.Polar,
    /** Angle range of theta [start, end, ?step] (radians; includive) */
    range: number[],
    /** Expression: input angle `a: number`, output radius `r: number` */
    expr: Expression;
    coords: number[][];
}

/**
 * Create new parametric line
 * @param expr Expression takes angle `a: number` returns radius `r: number`
 * @param range range of angle [start, end, ?step] (inclusive, in radians)
 * @param color color of line (Default=black)
 */
export function createPolarLine(expr: Expression, range: number[], color = '#000000') {
    return {
        type: LineType.Polar,
        error: false,
        expr,
        range,
        color,
    } as ILinePolar;
}

/** Subtract lines from one another */
export interface ILineSubtraction extends ILine {
    type: LineType.Subtraction;
    /** IDs of lines to subtract: ids[0] - ids[1] - ids[2] - ... */
    ids: number[];
    coords: number[][];
}

/**
 * Return subtraction line
 * @param ids IDs of lines to subtract: ids[0] - ids[1] - ids[2] - ...
 * @param color color of line (default=black)
 */
export function createSubtractionLine(ids: number[], color = '#000000') {
    return {
        type: LineType.Subtraction,
        ids,
        color,
    } as ILineSubtraction;
}

/** Apprimate line by a polynomial */
export interface ILineTaylorApprox extends ILine {
    type: LineType.TaylorApprox;
    /** ID of line to approximate */
    id: number;
    /** degree to approximate to (highest power) */
    degree: number;
    /** approximate around this X co-ordinate */
    x: number;
    coords: number[][];
}

/**
 * Return taylor apprimation line
 * @param id ID of line to approximate
 * @param degree degree of polynomial
 * @param x X-coordinate to centre around
 * @param color color of line (default=black)
 */
export function createTaylorApproxLine(id: number, degree = 4, x = 0, color = '#000000') {
    return {
        type: LineType.TaylorApprox,
        id,
        degree,
        x,
        color,
    } as ILineTaylorApprox;
}

/** Translate lines geometrically: shift, scale, rotate */
export interface ILineTranslate extends ILine {
    type: LineType.Translate;
    /** ID of line to translate */
    id: number;
    /** (x, y) to shift */
    shift: number[];
    /** (x, y) scale factors */
    scale: number[];
    /** Radians to rotate around origin */
    rotate: number;
    coords: number[][];
}

/**
 * Return translation line
 * @param id ID of line to translate
 * @param color color of line (default=black)
 */
export function createTranslationLine(id: number, shiftX = 0, shiftY = 0, scaleX = 1, scaleY = 1, rotate = 0, color = '#000000') {
    return {
        type: LineType.Translate,
        id,
        shift: [shiftX, shiftY],
        scale: [scaleX, scaleY],
        rotate,
        color,
    } as ILineTranslate;
}

/** Line: X */
export interface ILineX extends ILine {
    type: LineType.X;
    /** Expression: take `x: number`, returns `y: number` */
    expr: Expression;
    /** Generated co-ordinates */
    coords?: number[][];
}

/**
 * Create new line: y = x
 * @param expr Expression takes `x: number` returns `y: number`
 * @param color color of line (Default=black)
 */
export function createLineX(expr: Expression, color = '#000000') {
    return {
        type: LineType.X,
        error: false,
        expr,
        color,
    } as ILineX;
}

/** Line: Y */
export interface ILineY extends ILine {
    type: LineType.Y;
    /** Expression: take `y: number`, returns `y: number` */
    expr: Expression;
    /** Generated co-ordinates */
    coords?: number[][];
}

/**
 * Create new line: x = y
 * @param expr Expression takes `y: number` returns `x: number`
 * @param color color of line (Default=black)
 */
export function createLineY(expr: Expression, color = '#000000') {
    return {
        type: LineType.Y,
        error: false,
        expr,
        color,
    } as ILineY;
}

/** Type containing all ILine interfaces */
export type AllLines = ILineAddition | ILineAntiderivative | ILineComplexField | ILineComplexImSep | ILineComplexIm  | ILineComplexRe | ILineComplexReSep | ILineCoords | ILineDerivative | ILineDivision | ILineMultiplication | ILineParametric | ILinePolar | ILineSubtraction | ILineTaylorApprox | ILineTranslate | ILineX | ILineY;
//#endregion

export class Graph {
    /** Graph options */
    public readonly opts: IOpts;
    /** Internal cache of lines */
    private readonly lines: Map<number, AllLines>;
    /** Current line ID */
    private _lineID = 0;

    /**
     * @param opts graph options (note, object is copied)
     */
    public constructor(opts?: IOptsOptional) {
        this.opts = populateOpts(opts || {});
        this.lines = new Map();
    }

    /** Get canvas coordinates of (x,y) coordinates on graph */
    public getCoordinates(x: number, y: number) {
        return [
            ((x - this.opts.xstart) / this.opts.xstep) * this.opts.xstepGap,
            ((this.opts.ystart - y) / this.opts.ystep) * this.opts.ystepGap
        ];
    }

    /** Get graph coordinates from canvas (x, y) */
    public fromCoordinates(x: number, y: number) {
        return [
            ((this.opts.xstep * x) / this.opts.xstepGap) + this.opts.xstart,
            this.opts.ystart - ((y * this.opts.ystep) / this.opts.ystepGap)
        ];
    }

    /** Get span (px) of x-axis, given width of the canvas */
    public getXAxisSpan(width: number) {
        return (width / this.opts.xstepGap) * this.opts.xstep;
    }

    /** Get span of y-axis, given height of the canvas */
    public getYAxisSpan(height: number) {
        return (height / this.opts.ystepGap) * this.opts.ystep;
    }

    /** Add line to internal cache. Return the line ID. */
    public addLine(line: AllLines) {
        let id = this._lineID++;
        this.lines.set(id, line);
        return id;
    }

    /** Get line with the given ID */
    public getLine(lineID: number) {
        return this.lines.get(lineID);
    }

    /** Return iterator containing all line IDs */
    public getLineIDs() {
        return this.lines.keys();
    }

    /** Remove line with given ID */
    public delLine(lineID: number) {
        this.lines.delete(lineID);
    }

    /** Generate co-ordinates of line with given ID */
    public generate(width: number, height: number, lineID: number) {
        const xAxisSpan = this.getXAxisSpan(width), yAxisSpan = this.getYAxisSpan(height);
        const line = this.lines.get(lineID), ncoords = this.opts.ncoords;
        let error: string | undefined;
        switch (line.type) {
            case LineType.Addition: {
                const lines: AllLines[] = [];
                for (const id of line.ids) {
                    const line = this.lines.get(id);
                    if (line === undefined) error = `Line ID ${id} doesn't exist`;
                    else if (line.coords === undefined || line.coords.length === 0) error = `Line ID ${id} must be drawn before being used in addition`;
                    else lines.push(line);
                    if (error) break;
                }
                if (error) break;
                const coords: number[][] = [];
                for (let i = 0; i < lines[0].coords.length; i++) {
                    let [x, y] = lines[0].coords[i];
                    for (let j = 1; j < lines.length; j++)
                        if (lines[j].coords[i])
                            y += lines[j].coords[i][1];
                    if (isFinite(y) && !isNaN(y)) coords.push([x, y]);
                }
                line.coords = coords;
                break;          
            }
            case LineType.Antiderivative: {
                const other = this.lines.get(line.id);
                if (other === undefined) error = `Line ID ${line.id} doesn't exist`;
                else if (other.coords === undefined) error = `Line ID ${line.id} must be drawn before calculating its antiderivative`;
                else line.coords = calcCoordsFromGradient(other.coords as number[][], line.C);
                break;
            }
            case LineType.ComplexField: {
                const io: Complex[][] = []; // [Input, Output][]
                // const outsN = []; // [zOutMag, zOutArg][]
                // let maxMag = -1;
                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        const idx = x + y * width;
                        const [a, b] = this.fromCoordinates(x, y), zIn = new Complex(a, b);
                        line.expr.setSymbol("z", zIn);
                        const zOut = line.expr.evaluate() as Complex;
                        if (line.expr.error) break;
                        // const mag = zOut.getMag(), arg = zOut.getArg();
                        // if (mag > maxMag) maxMag = mag;
                        io[idx] = [zIn, zOut];
                        // outsN[idx] = [mag, arg];
                    }
                    if (line.expr.error) break;
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = io;
                break;
            }
            case LineType.ComplexIm: {
                const inc = xAxisSpan / ncoords, coords: number[][] = [];
                for (var i = 0, x = this.opts.xstart; i < ncoords; ++i, x += inc) {
                    line.expr.setSymbol('z', new Complex(line.real, x));
                    let z = line.expr.evaluate() as Complex;
                    if (line.expr.error) break;
                    if (Graph.validCoords(z.a, z.b)) coords.push([z.a, z.b]);
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = coords;
                break;
            }
            case LineType.ComplexImSep: {
                const inc = xAxisSpan / ncoords, coords: number[][] = [];
                for (var i = 0, x = this.opts.xstart; i < ncoords; ++i, x += inc) {
                    line.expr.setSymbol('z', new Complex(line.real, x));
                    let z = line.expr.evaluate() as Complex;
                    if (line.expr.error) break;
                    let aok = Graph.validCoords(x, z.a);
                    let bok = Graph.validCoords(x, z.b);
                    if (aok || bok) coords.push([x, aok ? z.a : undefined, bok ? z.b : undefined]);
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = coords;
                break;
            }
            case LineType.ComplexRe: {
                const inc = xAxisSpan / ncoords, coords: number[][] = [];
                for (var i = 0, x = this.opts.xstart; i < ncoords; ++i, x += inc) {
                    line.expr.setSymbol('z', new Complex(x, line.imag));
                    let z = line.expr.evaluate() as Complex;
                    if (line.expr.error) break;
                    if (Graph.validCoords(z.a, z.b)) coords.push([z.a, z.b]);
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = coords;
                break;
            }
            case LineType.ComplexReSep: {
                const inc = xAxisSpan / ncoords, coords: number[][] = [];
                for (var i = 0, x = this.opts.xstart; i < ncoords; ++i, x += inc) {
                    line.expr.setSymbol('z', new Complex(x, line.imag));
                    let z = line.expr.evaluate() as Complex;
                    if (line.expr.error) break;
                    let aok = Graph.validCoords(x, z.a);
                    let bok = Graph.validCoords(x, z.b);
                    if (aok || bok) coords.push([x, aok ? z.a : undefined, bok ? z.b : undefined]);
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = coords;
                break;
            }
            case LineType.Coords:
                break;
            case LineType.Derivative: {
                const other = this.lines.get(line.id);
                if (other === undefined) error = `Line ID ${line.id} doesn't exist`;
                else if (other.coords === undefined) error = `Line ID ${line.id} must be drawn before calculating its derivative`;
                else line.coords = calcGradient(other.coords as number[][]);
                break;
            }
            case LineType.Division: {
                const lines: AllLines[] = [];
                for (const id of line.ids) {
                    const line = this.lines.get(id);
                    if (line === undefined) error = `Line ID ${id} doesn't exist`;
                    else if (line.coords === undefined || line.coords.length === 0) error = `Line ID ${id} must be drawn before being used in division`;
                    else lines.push(line);
                    if (error) break;
                }
                if (error) break;
                const coords: number[][] = [];
                for (let i = 0; i < lines[0].coords.length; i++) {
                    let [x, y] = lines[0].coords[i];
                    for (let j = 1; j < lines.length; j++)
                        if (lines[j].coords[i])
                            y /= lines[j].coords[i][1];
                    if (isFinite(y) && !isNaN(y)) coords.push([x, y]);
                }
                line.coords = coords;
                break;
            }
            case LineType.Multiplication: {
                const lines: AllLines[] = [];
                for (const id of line.ids) {
                    const line = this.lines.get(id);
                    if (line === undefined) error = `Line ID ${id} doesn't exist`;
                    else if (line.coords === undefined || line.coords.length === 0) error = `Line ID ${id} must be drawn before being used in multiplication`;
                    else lines.push(line);
                    if (error) break;
                }
                if (error) break;
                const coords: number[][] = [];
                for (let i = 0; i < lines[0].coords.length; i++) {
                    let [x, y] = lines[0].coords[i];
                    for (let j = 1; j < lines.length; j++)
                        if (lines[j].coords[i])
                            y *= lines[j].coords[i][1];
                    if (isFinite(y) && !isNaN(y)) coords.push([x, y]);
                }
                line.coords = coords;
                break;
            }
            case LineType.Parametric: {
                const inc = line.range[2] ?? (Math.abs(line.range[1] - line.range[0]) / ncoords), coords: number[][] = [];
                for (let i = 0, p = line.range[0]; p <= line.range[1]; ++i, p += inc) {
                    line.exprx.setSymbol(this.opts.parametricVar, p);
                    let x = line.exprx.evaluate() as number;
                    if (line.exprx.error) break;
                    if ((x as any).b !== undefined) x = (x as any).a; // Complex result?
                    line.expry.setSymbol(this.opts.parametricVar, p);
                    let y = line.expry.evaluate() as number;
                    if (line.expry.error) break;
                    if ((y as any).b !== undefined) y = (y as any).a; // Complex result?
                    if (Graph.validCoords(x, y)) coords.push([x, y]);
                }
                if (line.exprx.error) error = line.exprx.handleError();
                else if (line.expry.error) error = line.expry.handleError();
                line.coords = coords;
                break;
            }
            case LineType.Polar: {
                let inc = line.range[2] ?? (Math.abs(line.range[1] - line.range[0]) / ncoords), coords: number[][] = [];
                for (let i = 0, θ = line.range[0]; θ <= line.range[1]; ++i, θ += inc) {
                    line.expr.setSymbol("a", θ);
                    let r = line.expr.evaluate() as number;
                    if (line.expr.error) break;
                    if ((r as any).b !== undefined) r = (r as any).a; // Complex
                    if (!isNaN(r) && isFinite(r)) coords.push([r * Math.cos(θ), r * Math.sin(θ)]);
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = coords;
                break;
            }
            case LineType.Subtraction: {
                const lines: AllLines[] = [];
                for (const id of line.ids) {
                    const line = this.lines.get(id);
                    if (line === undefined) error = `Line ID ${id} doesn't exist`;
                    else if (line.coords === undefined || line.coords.length === 0) error = `Line ID ${id} must be drawn before being used in subtraction`;
                    else lines.push(line);
                    if (error) break;
                }
                if (error) break;
                const coords: number[][] = [];
                for (let i = 0; i < lines[0].coords.length; i++) {
                    let [x, y] = lines[0].coords[i];
                    for (let j = 1; j < lines.length; j++)
                        if (lines[j].coords[i])
                            y -= lines[j].coords[i][1];
                    if (isFinite(y) && !isNaN(y)) coords.push([x, y]);
                }
                line.coords = coords;
                break;
            }
            case LineType.TaylorApprox: {
                const other = this.lines.get(line.id);
                if (other === undefined) error = `Line ID ${line.id} doesn't exist`;
                else if (other.coords === undefined) error = `Line ID ${line.id} must be drawn before approximating it`;
                if (error) break;
                const coeffs = taylorApprox(other.coords, line.degree, line.x); // Co-efficients
                const inc = xAxisSpan / ncoords, coords: number[][] = [];
                for (let i = 0, x = this.opts.xstart; i < ncoords; ++i, x += inc) {
                    let y = 0;
                    for (let j = 0; j < coeffs.length; ++j) y += coeffs[j] * (x - line.x) ** j;
                    if (Graph.validCoords(x, y)) coords.push([x, y]);
                }
                line.coords = coords;
                break;
            }
            case LineType.Translate: {
                const other = this.lines.get(line.id);
                if (other === undefined) error = `Line ID ${line.id} doesn't exist`;
                else if (other.coords === undefined) error = `Line ID ${line.id} must be drawn before transforming it`;
                if (error) break;
                const coords: number[][] = [], S = Math.sin(line.rotate), C = Math.cos(line.rotate);
                for (let i = 0; i < other.coords.length; ++i) {
                    let [x, y] = other.coords[i];
                    x += line.shift[0];
                    y += line.shift[1];
                    if (isFinite(line.scale[0])) x *= line.scale[0];
                    if (isFinite(line.scale[1])) y *= line.scale[1];
                    ([x, y] = [
                        x * C - y * S,
                        x * S + y * C,
                    ]);
                    if (Graph.validCoords(x, y)) coords.push([x, y]);
                }
                line.coords = coords;
                break;
            }
            case LineType.X: {
                const inc = xAxisSpan / ncoords, coords: number[][] = [];
                for (let i = 0, x = this.opts.xstart; i < ncoords; ++i, x += inc) {
                    line.expr.setSymbol("x", x);
                    let y = line.expr.evaluate() as number;
                    if (line.expr.error) break;
                    if ((y as any).b !== undefined) y = (y as any).a; // Complex?
                    if (Graph.validCoords(x, y)) coords.push([x, y]);
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = coords;
                break;
            }
            case LineType.Y: {
                const inc = yAxisSpan / ncoords, coords: number[][] = [];
                for (let i = 0, y = this.opts.ystart; i < ncoords; ++i, y -= inc) {
                    line.expr.setSymbol("y", y);
                    let x = line.expr.evaluate() as number;
                    if (line.expr.error) break;
                    if ((x as any).b !== undefined) x = (x as any).a;
                    if (Graph.validCoords(x, y)) coords.push([x, y]);
                }
                if (line.expr.error) error = line.expr.handleError();
                line.coords = coords;
                break;
            }
            default:
                error = `Unknown line type '${(line as any).type}'`;
        }

        if (error) {
            line.error = true;
            line.emsg = error;
        } else {
            line.error = false;
            delete line.emsg;
        }
    }

    /** Sketch lines with IDs that are given, or all lines if not provided, to the given canvas */
    public sketch(canvas: HTMLCanvasElement | OffscreenCanvas, lineIDs?: number[]) {
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const yAxisSpan = this.getYAxisSpan(canvas.height), xAxisSpan = this.getXAxisSpan(canvas.width);
        const EPSILON = Number.EPSILON;

        const ids = lineIDs ? lineIDs.filter(id => this.lines.has(id)) : Array.from(this.lines.keys());
        let met = false;
        for (const id of ids) {
            const line = this.lines.get(id);
            if (line === undefined) continue;
            if (line.type === LineType.ComplexField) {
                if (met) {
                    line.error = true;
                    line.emsg = `Can only draw one 'field' line type`;
                } else {
                    this.generate(canvas.width, canvas.height, id);
                    this._plotComplexField(ctx, canvas.width, canvas.height, line.coords);
                    met = true;
                }
            }
        }

        // X-axis
        xAxis: {
            let y: number, line: boolean; // (1) starting y coordinate, (2) draw axis?
            if (this.opts.ystart < 0) { // Line at top of screen
                y = 0;
                line = false;
                ctx.textBaseline = 'top';
            } else if (this.opts.ystart - yAxisSpan > 0) { // Line at bottom of screen
                y = canvas.height;
                line = false;
                ctx.textBaseline = 'bottom';
            } else {
                ctx.textBaseline = 'middle';
                line = true;
                y = this.getCoordinates(0, 0)[1];
            }

            // Draw x-axis line?
            if (line) {
                ctx.beginPath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = this.opts.axisThickness;
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw numbers
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';

            const lll = 5, subGridInc = this.opts.xstepGap / this.opts.subGridDivs;
            for (let i = 0, n = roundMultiple(this.opts.xstart, this.opts.xstep, roundTowards0), x = this.getCoordinates(n, 0)[0]; x < canvas.width; i++, n += this.opts.xstep, x += this.opts.xstepGap) {
                if (Math.abs(n) >= EPSILON && this.opts.markXAxis) {
                    const label = this.opts.xstepLabel ? this.opts.xstepLabel(n) : n.toPrecision(this.opts.labelPrecision);
                    if (line) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 1;
                        ctx.moveTo(x, y - lll);
                        ctx.lineTo(x, y + lll);
                        ctx.stroke();
                        ctx.fillText(label, x, y - lll * 2);
                    } else {
                        ctx.fillText(label, x, y);
                    }
                }

                if (this.opts.grid) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = this.opts.gridThickness;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
            }

            if (this.opts.grid && this.opts.subGridDivs > 0) {
                const subGridInc = this.opts.xstepGap / this.opts.subGridDivs;
                let x = this.getCoordinates(roundMultiple(this.fromCoordinates(0, 0)[0], this.opts.xstep / this.opts.subGridDivs, roundTowardsInf), 0)[0];
                for (let i = 0; x <= canvas.width; i++, x += subGridInc) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = this.opts.gridThickness / 2;
                    ctx.moveTo(x, 0);
                    ctx.lineTo(x, canvas.height);
                    ctx.stroke();
                }
            }
        }

        // Y-axis
        yAxis: {
            let x: number, line: boolean; // (1) Starting X coordinate, (2) draw Y axis?
            if (this.opts.xstart > 0) { // Line at left of screen
                x = 0;
                line = false;
                ctx.textAlign = 'left';
            } else if (this.opts.xstart + xAxisSpan < 0) { // Line at right of screen
                x = canvas.width;
                ctx.textAlign = 'right';
                line = false;
            } else {
                ctx.textAlign = 'left';
                line = true;
                x = this.getCoordinates(0, 0)[0];
            }

            // Draw y-axis line?
            if (line) {
                ctx.beginPath();
                ctx.strokeStyle = 'black';
                ctx.lineWidth = this.opts.axisThickness;
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }

            // Draw numbers
            ctx.fillStyle = 'black';
            ctx.textBaseline = 'middle';

            const lll = 5;
            for (let i = 0, n = roundMultiple(this.opts.ystart, this.opts.ystep, roundTowards0), y = this.getCoordinates(0, n)[1]; y < canvas.height; i++, n -= this.opts.ystep, y += this.opts.ystepGap) {
                if (Math.abs(n) >= EPSILON && this.opts.markYAxis) {
                    const label = this.opts.ystepLabel ? this.opts.ystepLabel(n) : n.toPrecision(this.opts.labelPrecision);
                    if (line) {
                        ctx.beginPath();
                        ctx.strokeStyle = 'black';
                        ctx.lineWidth = 1;
                        ctx.moveTo(x - lll, y);
                        ctx.lineTo(x + lll, y);
                        ctx.stroke();
                        ctx.fillText(label, x + lll * 1.5, y);
                    } else {
                        ctx.fillText(label, x, y);
                    }
                }
                if (this.opts.grid) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = this.opts.gridThickness;
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
            }

            if (this.opts.grid && this.opts.subGridDivs > 0) {
                const subGridInc = this.opts.ystepGap / this.opts.subGridDivs;
                let y = this.getCoordinates(0, roundMultiple(this.fromCoordinates(0, 0)[1], this.opts.ystep / this.opts.subGridDivs, roundTowardsInf))[1];
                for (let i = 0; y <= canvas.height; i++, y += subGridInc) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = this.opts.gridThickness / 2;
                    ctx.moveTo(0, y);
                    ctx.lineTo(canvas.width, y);
                    ctx.stroke();
                }
            }
        }

        // lines
        lines: {
            for (const id of ids) {
                const line = this.lines.get(id);
                this.generate(canvas.width, canvas.height, id);
                if (line.error || line.coords === undefined || line.coords.length === 0 || line.type === LineType.ComplexField) continue;
                if (line.type === LineType.ComplexReSep || line.type === LineType.ComplexImSep) {
                    // REAL part
                    const rcoords = line.coords.filter(([x, y]) => y !== undefined).map(([x, y]) => this.getCoordinates(x, y));
                    this._plotPoints(ctx, canvas.width, canvas.height, rcoords, line, line.colorReal);
                    // IMAGINARY part
                    const icoords = line.coords.filter(([x, _, y]) => y !== undefined).map(([x, _, y]) => this.getCoordinates(x, y));
                    this._plotPoints(ctx, canvas.width, canvas.height, icoords, line, line.colorImag);
                } else {
                    let coords = line.coords.map(([x, y]) => this.getCoordinates(x, y));
                    this._plotPoints(ctx, canvas.width, canvas.height, coords, line);
                }
            }
        }
    }

    /** Plot the co-ordinates of a line */
    private _plotPoints(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, width: number, height: number, coords: number[][], line: AllLines, color?: string) {
        ctx.lineWidth = line.lineWidth ?? this.opts.lineWidth;
        ctx.strokeStyle = (color ?? line.color) ?? 'black';
        ctx.setLineDash(line.dasharray ? line.dasharray : []);

        let off = 10, noff = -off, asyh = height / 1.5; // Check that coords are in screen bounds!
        height += off;
        width += off;
        if (line.join === undefined || line.join) {
            coords = coords.filter(([x, y]) => (x >= noff && x < width && y >= noff && y < height));
            let inPath = false;
            let pathSectionStart: number[]; // Coordinates of path start
            for (let i = 0; i < coords.length; i++) {
                let [x, y] = coords[i];
                if (inPath) {
                    ctx.lineTo(x, y);
                } else {
                    ctx.beginPath();
                    if (line.shade && line.shade[1] === "t") ctx.setLineDash([10, 4]); // Not equal to - dashed line
                    ctx.moveTo(x, y);
                    pathSectionStart = coords[i];
                    inPath = true;
                }

                let stroke = false; // Close the path?
                if (coords[i + 1] === undefined) {
                    stroke = true;
                } else if (Math.abs(y - coords[i + 1][1]) >= asyh) {
                    stroke = true;
                    inPath = false;
                } else if (Math.abs(coords[i + 1][0] - x) > (line.drawAll ? width * .33 : this.opts.xstep)) {
                    stroke = true;
                    inPath = false;
                }
                if (stroke) {
                    if (line.shade) {
                        if (line.shade[0] === "g") { // Greater -> Above line
                            ctx.lineTo(x, -off);
                            ctx.lineTo(pathSectionStart[0], -off);
                            ctx.lineTo(pathSectionStart[0], pathSectionStart[1]);
                        } else if (line.shade[0] === "l") { // Less -> Below line
                            ctx.lineTo(x, height);
                            ctx.lineTo(pathSectionStart[0], height);
                            ctx.lineTo(pathSectionStart[0], pathSectionStart[1]);
                        }
                    }
                    ctx.stroke();
                    if (line.shade) {
                        ctx.fillStyle = (line.color || "#000000") + "35";
                        ctx.fill();
                    }
                }
            }
        } else {
            ctx.fillStyle = line.color ?? 'black';
            coords.forEach(([x, y]) => {
                if (x < noff || x > width || y < noff || y > height) return;
                ctx.beginPath();
                ctx.arc(x, y, ctx.lineWidth, 0, 6.3);
                ctx.fill();
            });
        }
    }

    /** Plot complex field using domain coloring */
    private _plotComplexField(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, width: number, height: number, points: Complex[][]) {
        const img = ctx.getImageData(0, 0, width, height);
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                let idx = x + y * width, pidx = 4 * idx;
                // let [zIn, zOut] = outs[x + y * this.width];
                // let [mag, arg] = outsN[x + y * this.width];
                const arg = points[idx][1].getArg();
                const hu = arg < 0 ? 360 + arg / Math.PI * 180 : arg / Math.PI * 180;
                // let bright = data.C ? mag / maxMag * 75 : 50;
                const rgb = hsl2rgb(hu, 100, 50);
                img.data[pidx] = rgb[0];
                img.data[pidx + 1] = rgb[1];
                img.data[pidx + 2] = rgb[2];
                img.data[pidx + 3] = 255;
            }
        }
        ctx.putImageData(img, 0, 0);
    }

    /** Are the given (x, y) valid co-ordinates? */
    public static validCoords(x: number, y: number) {
        return !isNaN(x) && isFinite(x) && !isNaN(y) && isFinite(y);
    }

    /** Return equation in terms of x to approximate the given line, of degree `deg` around `around` */
    public getTaylorApprox(id: number, deg = 4, around = 0) {
        const line = this.lines.get(id);
        if (line === undefined || line.coords === undefined) return "";
        const coeffs = taylorApprox(line.coords, deg, around);
        let eq = "";
        for (let i = 0; i < coeffs.length; i++) {
            if (coeffs[i] === 0) continue;
            let term = Math.abs(coeffs[i]).toString();
            if (i > 0) {
                term += " * " + (around === 0 ? "x" : `(x ${around < 0 ? "+" : "-"} ${Math.abs(around)})`);
                if (i !== 1) term += " ** " + i;
            }
            if (coeffs[i] < 0) term = "-" + (i === 0 ? "" : " ") + term;
            else if (i > 0) term = "+ " + term;
            eq += term + " ";
        }
        return eq.trim();
    }
}

//#region Utility functions
/** Linear interpolate between two bounds */
const lerp = (min: number, max: number, dist: number) => min + (max - min) * dist;

/** Round N to the nearest multiple of M using the round function roundF (=Math.round) */
const roundMultiple = (n: number, m: number, roundFn = Math.round) => roundFn(n / m) * m;
const roundTowards0 = (n: number) => n < 0 ? Math.ceil(n) : Math.floor(n);
const roundTowardsInf = (n: number) => n < 0 ? Math.floor(n) : Math.ceil(n);

/** Calculate coordinates of change of gradient (differentiation) */
function calcGradient(coords: number[][]) {
    let pts = [];
    for (let i = 1; i < coords.length; ++i) {
        let [x1, y1] = coords[i - 1], [x2, y2] = coords[i];
        pts.push([x1, (y2 - y1) / (x2 - x1)]);
    }
    return pts;
}

/** Calculate original coordinates from change of gradient (integration) (with C=<C>) */
function calcCoordsFromGradient(coords: number[][], C = 0) {
    coords = [...coords];
    let splits: number[] = [], last = coords[0][0];
    for (let i = 1, n = 1; i < coords.length; i++, n++) {
        let next = coords[i][0];
        if (Math.sign(last) !== Math.sign(next)) {
            splits.push(n);
            n = 0;
            break;
        }
    }

    const arrays: number[][][] = [];
    splits.forEach(split => arrays.push(coords.splice(0, split)));
    arrays.push(coords);

    const points: number[][] = [];
    arrays.forEach(array => {
        let pts = [[0, C]];
        if (Math.sign(array[0][0]) === -1) {
            for (let i = array.length - 1, j = 0; i >= 0; --i, ++j) {
                let [x2, m] = array[i], [x1, y1] = pts[j];
                let y2 = m * (x2 - x1) + y1;
                pts.push([x2, y2]);
            }
            pts.reverse();
        } else {
            for (let i = 0; i < array.length; ++i) {
                let [x2, m] = array[i], [x1, y1] = pts[i];
                let y2 = m * (x2 - x1) + y1;
                pts.push([x2, y2]);
            }
        }
        points.push(...pts);
    });
    return points;
}

/** Get approx. coordinates where one part if specifid (if many is truthy, return array of coordinates) */
function getCorrespondingCoordinate(coord: number, axis: "x" | "y", coords: number[][], many = false, dp = undefined, removeDuplicate = true) {
    const IDX = axis === 'x' ? 0 : 1;
    let region = many ? [] : undefined, last = coords[0];
    if (dp !== undefined) coords.forEach((_, i) => {
        coords[i][0] = +coords[i][0].toFixed(dp);
        coords[i][1] = +coords[i][1].toFixed(dp);
    });
    for (let i = 1; i < coords.length; ++i) {
        let next = coords[i];
        if (coord === next[IDX]) {
            if (many) region.push(next);
            else { region = next; break; }
        } else if (coord === last[IDX]) {
            if (many) region.push(last);
            else { region = last; break; }
        } else if ((coord >= last[IDX] && coord <= next[IDX]) || (coord >= next[IDX] && coord <= last[IDX])) {
            if (many) {
                region.push([
                    lerp(next[0], last[0], 0.5),
                    lerp(next[1], last[1], 0.5)
                ]);
            } else {
                region = [
                    lerp(next[0], last[0], 0.5),
                    lerp(next[1], last[1], 0.5)
                ];
                break;
            }
        }
        last = next;
    }
    if (removeDuplicate && many && region.length > 1) { // Remove coords that are really close to eachother (on opposite axis)
        const oIDX = IDX ? 0 : 1, step = coords[1][oIDX] - coords[0][oIDX];
        removeCloseCoords(region, step, IDX ? 'x' : 'y');
    }
    return region;
}

/** Remove successive coords which are <d_min> from each other (mutates input array) */
function removeCloseCoords(coords: number[][], d_min: number, axis: "x" | "y") {
    const idx = axis === 'x' ? 0 : 1;
    let last = coords[0], next: number[];
    for (let i = 1; i < coords.length;) {
        next = coords[i];
        if (Math.abs(next[idx] - last[idx]) <= d_min) {
            coords.splice(i, 1);
        } else {
            ++i;
        }
        last = next;
    }
}

/** Get index of nearest matching co-ordinates to given co-ordinate in the given axis */
function getCorrepondingCoordinateIndex(coord: number, axis: "x" | "y", coords: number[][], many = false, dp = undefined) {
    const IDX = axis === 'x' ? 0 : 1;
    let region: number[] | number = many ? [] : undefined, last = coords[0];
    if (dp !== undefined) coords.forEach((_, i) => {
        coords[i][0] = +coords[i][0].toFixed(dp);
        coords[i][1] = +coords[i][1].toFixed(dp);
    });
    if (coord === last[IDX]) return 0;
    for (let i = 1; i < coords.length; ++i) {
        let next = coords[i];
        if (coord === next[IDX]) {
            if (many) region.push(i);
            else { region = i; break; }
        } else if ((coord >= last[IDX] && coord <= next[IDX]) || (coord >= next[IDX] && coord <= last[IDX])) {
            let dl = Math.abs(coord - last[IDX]); // Difference: value and last
            let dn = Math.abs(coord - next[IDX]); // Difference: value and next
            let j = dl < dn ? i - 1 : i; // Find smallest difference
            if (many) {
                region.push(j);
            } else {
                region = j;
                break;
            }
        }
        last = next;
    }
    return region;
}

/** Return coefficients of x^0, x^1, ..., x^n for Taylor approximation given coordinates */
function taylorApprox(coords: number[][], deg: number, around = 0) {
    let denom = 1; // Denominator of fractions
    const i0 = getCorrepondingCoordinateIndex(around, 'x', coords, false) as number;
    const before = [], after = []; // Coordinates before/after (0,y) at i0
    for (let a = 1; a <= deg * 2; a++) {
        before.unshift(coords[i0 - a]);
        after.push(coords[i0 + a]);
    }
    let ncoords = [...before, coords[i0], ...after].filter(x => x);
    const coeffs = [coords[i0][1]];
    for (let a = 0; a < deg; a++) {
        denom *= a + 1;
        ncoords = calcGradient(ncoords);
        const coord = getCorrespondingCoordinate(around, 'x', ncoords, false);
        const y = coord == undefined ? around : coord[1];
        coeffs.push(1 / denom * y);
    }
    return coeffs;
}

function hsl2rgb(h: number, s: number, l: number) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2, rgb: number[];
    if (0 <= h && h < 60) rgb = [c, x, 0];
    else if (60 <= h && h < 120) rgb = [x, c, 0];
    else if (120 <= h && h < 180) rgb = [0, c, x];
    else if (180 <= h && h < 240) rgb = [0, x, c];
    else if (240 <= h && h < 300) rgb = [x, 0, c];
    else if (300 <= h && h < 360) rgb = [c, 0, x];
    else return [0, 0, 0];
    return rgb.map(n => (n + m) * 255);
}
//#endregion