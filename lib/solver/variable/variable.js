"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = __importDefault(require("../utils/utils"));
class Variable {
    constructor({ currentVal, max = 1000, min = 0 }) {
        this.currentVal = 0;
        this.min = 0;
        this.max = 1000;
        this.attempts = [];
        this.generateRange = () => {
            const { min, max } = this;
            const output = [];
            for (let i = min + 1; i < max; i++) {
                output.push(i);
            }
            this.attempts = output;
        };
        this.next = () => {
            this.attempts = this.attempts.sort(() => Math.random() - 0.5);
            const output = this.attempts[0];
            this.currentVal = output;
        };
        this.id = utils_1.default();
        this.attempts = [];
        this.min = min;
        this.max = max;
        this.currentVal = currentVal !== undefined ? currentVal : min;
        this.generateRange();
    }
}
exports.default = Variable;
//# sourceMappingURL=variable.js.map