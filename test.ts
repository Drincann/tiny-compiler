import { tokenize } from "./src";

console.log(tokenize('(add 22 (subtract 4 2))'));
console.log(tokenize('(concat (concat "" "a") "bc")'));