import { tokenize, parse } from "../parser";
import { generate } from "../generator";

export const compile = (src: string) => generate(parse(tokenize(src)));