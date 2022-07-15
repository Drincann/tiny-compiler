import { isNameChar, isNumberChar } from "../helper";

export interface ParenToken {
  type: 'paren';
  value: '(' | ')';
}
export interface NumberToken {
  type: 'number';
  value: `${number}`;
}
export interface StringToken {
  type: 'string';
  value: `"${string}"`;
}
export interface NameToken {
  type: 'name';
  value: string;
}

export type Token =
  ParenToken
  | NumberToken
  | StringToken
  | NameToken;

type StateMachine = () => ({ done: boolean, token: Token | null });

const genStateMachine = (input: string): StateMachine => {
  const NONE = 0, STRING = 1, NUMBER = 2, NAME = 3;
  let state: number = NONE;
  let value = '';
  let cursor = 0;
  return (): { done: boolean, token: Token | null } => {
    const char = input[cursor];
    switch (state) {
      case NONE:
        ++cursor;
        switch (true) {
          case char === '\n' || char === ' ':
            break;
          case char === '(' || char === ')': // end of the paren
            return {
              done: cursor >= input.length,
              token: { type: 'paren', value: char } as ParenToken,
            };
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
        ++cursor;
        switch (char) {
          case '"': // end of the string
            state = NONE;
            value += '"';
            return {
              done: cursor >= input.length,
              token: { type: 'string', value: value } as StringToken,
            };
          default:
            value += char;
            break;
        }
        break;

      case NUMBER:
        switch (true) {
          case isNumberChar(char): // in number
            ++cursor;
            value += char;
            break;
          default: // end of the number
            state = NONE;
            return {
              done: cursor >= input.length,
              token: { type: 'number', value: value } as NumberToken,
            };
        }
        break;

      case NAME:
        switch (true) {
          case char === '\n' || char === ' ':
            state = NONE;
            return {
              done: cursor >= input.length,
              token: { type: 'name', value: value } as NameToken,
            };
          case isNameChar(char):
            ++cursor;
            value += char;
            break;
          default:
            throw new Error(`no such name value char: ${char}`);
        }
    }
    return {
      done: cursor >= input.length,
      token: null,
    };
  }
}

export const tokenize = (input: string) => {
  const tokens: Token[] = [];
  const step = genStateMachine(input);
  do {
    var { done, token } = step();
    if (token) tokens.push(token);
  } while (!done);
  return tokens;
};

