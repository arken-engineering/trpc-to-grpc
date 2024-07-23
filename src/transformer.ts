// src/transformer.ts
import { DataTransformer } from '@trpc/server';

const serialize = (object: any): string => {
  return JSON.stringify(object, (key, value) => {
    if (value instanceof Uint8Array) {
      return { _type: 'Uint8Array', data: Array.from(value) };
    }
    return value;
  });
};

const deserialize = (string: string): any => {
  return JSON.parse(string, (key, value) => {
    if (value && value._type === 'Uint8Array') {
      return new Uint8Array(value.data);
    }
    return value;
  });
};

export const customTransformer: DataTransformer = {
  serialize,
  deserialize,
};