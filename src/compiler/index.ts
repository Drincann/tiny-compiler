import { tokenize, parse } from "../parser";
import { generate } from "../generator";
import { transform } from "../transformer";

export const compile = (src: string) => generate(transform(parse(tokenize(src))));