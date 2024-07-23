"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customTransformer = void 0;
const serialize = (object) => {
    return JSON.stringify(object, (key, value) => {
        if (value instanceof Uint8Array) {
            return { _type: 'Uint8Array', data: Array.from(value) };
        }
        return value;
    });
};
const deserialize = (string) => {
    return JSON.parse(string, (key, value) => {
        if (value && value._type === 'Uint8Array') {
            return new Uint8Array(value.data);
        }
        return value;
    });
};
exports.customTransformer = {
    serialize,
    deserialize,
};
//# sourceMappingURL=transformer.js.map