import { parse, tokenize } from './parser';
import { generate } from './generator';
import { compile } from './compiler';
import { transform } from './transformer';
export const compiler = {
  steps: {
    tokenize,
    parse,
    transform,
    generate,
  },
  compile,
};