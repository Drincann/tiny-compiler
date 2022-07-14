import { tokenizer } from "./tokenizer";

console.log(tokenizer('(add 22 (subtract 4 2))'));
console.log(tokenizer('(concat (concat "" "a") "bc")'));