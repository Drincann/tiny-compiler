import { isNameChar, isNumberChar } from "../helper";

interface ParenToken {
  type: 'paren';
  value: '(' | ')';
}
interface NumberToken {
  type: 'number';
  value: `${number}`;
}
interface StringToken {
  type: 'string';
  value: `"${string}"`;
}
interface NameToken {
  type: 'name';
  value: string;
}

export type Token =
  ParenToken
  | NumberToken
  | StringToken
  | NameToken;

type StateMachine = (input: string) => Token | null;
const genStateMachine = (): StateMachine => {
  const NONE = 0, STRING = 1, NUMBER = 2, NAME = 3;
  let state: number = NONE;
  let value = '';
  return (char): Token | null => {
    switch (state) {
      case NONE:
        switch (true) {
          case char === '\n' || char === ' ':
            break;
          case char === '(' || char === ')': // end of the paren
            return { type: 'paren', value: char } as ParenToken;
          case isNumberChar(char) === true: // start of the number
            state = NUMBER;
            value = char;
            break;
          case char === '"': // start of the string
            state = STRING;
            value = '"'
            break;
          case isNameChar(char): // start of the name
            state = NAME;
            value = char;
            break;
          default:
            throw new Error(`no such name value char: ${char}`);
        }
        break;

      case STRING:
        switch (char) {
          case '"': // end of the string
            state = NONE;
            value += '"';
            return { type: 'string', value: value } as StringToken;
          default:
            value += char;
            break;
        }
        break;

      case NUMBER:
        switch (true) {
          case isNumberChar(char): // in number
            value += char;
            break;
          default: // end of the number
            state = NONE;
            return { type: 'number', value: value } as NumberToken;
        }
        break;

      case NAME:
        switch (true) {
          case char === '\n' || char === ' ':
            state = NONE;
            return { type: 'name', value: value } as NameToken;
          case isNameChar(char):
            value += char;
            break;
          default:
            throw new Error(`no such name value char: ${char}`);
        }
    }
    return null;
  }
}

export const tokenize = (input: string) => {
  const tokens: Token[] = [];
  const step = genStateMachine();
  for (const char of input) {
    const token = step(char);
    if (token) tokens.push(token);
  }
  return tokens;
};

