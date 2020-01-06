declare type TVariable = {
    currentVal: number;
    max?: number;
    min?: number;
};
export default class Variable {
    currentVal: number;
    private min;
    private max;
    private attempts;
    id: string;
    constructor({ currentVal, max, min }: TVariable);
    private generateRange;
    next: () => void;
}
export {};
