import { parse, tokenize } from './parser';
import { generate } from './generator';
import { compile } from './compiler';

export const compiler = {
  steps: {
    tokenize,
    parse,
    generate,
  },
  compile,
};