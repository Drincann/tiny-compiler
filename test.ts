import clc from 'cli-color';
import { parse, tokenize } from "./src";
import { generate } from "./src/generator/generator";

const cases = [{
  src: '(concat (concat "" "a") "bc")', except: {
    tokens: [{ "type": "paren", "value": "(" }, { "type": "name", "value": "concat" }, { "type": "paren", "value": "(" }, { "type": "name", "value": "concat" }, { "type": "string", "value": "\"\"" }, { "type": "string", "value": "\"a\"" }, { "type": "paren", "value": ")" }, { "type": "string", "value": "\"bc\"" }, { "type": "paren", "value": ")" }],
    ast: { "type": "Program", "body": [{ "type": "CallExpression", "name": "concat", "params": [{ "type": "CallExpression", "name": "concat", "params": [{ "type": "StringLiteral", "value": "\"\"" }, { "type": "StringLiteral", "value": "\"a\"" }] }, { "type": "StringLiteral", "value": "\"bc\"" }] }] },
    code: 'concat(concat("","a"),"bc")',
  },
}, {
  src: '(add 22 (subtract 4 2))', except: {
    tokens: [{ "type": "paren", "value": "(" }, { "type": "name", "value": "add" }, { "type": "number", "value": "22" }, { "type": "paren", "value": "(" }, { "type": "name", "value": "subtract" }, { "type": "number", "value": "4" }, { "type": "number", "value": "2" }, { "type": "paren", "value": ")" }, { "type": "paren", "value": ")" }],
    ast: { "type": "Program", "body": [{ "type": "CallExpression", "name": "add", "params": [{ "type": "NumberLiteral", "value": "22" }, { "type": "CallExpression", "name": "subtract", "params": [{ "type": "NumberLiteral", "value": "4" }, { "type": "NumberLiteral", "value": "2" }] }] }] },
    code: 'add(22,subtract(4,2))',
  },
},
];

const compare = (o1: any, o2: any): boolean => {
  try {
    o1 = JSON.parse(JSON.stringify(o1));
    o2 = JSON.parse(JSON.stringify(o2));

    // root type
    if (typeof o1 !== typeof o2) return false;

    if (typeof o1 === 'object') {
      // field name
      if (new Set(Object.keys(o1).concat(Object.keys(o2))).size
        !== new Set(Object.keys(o1)).size) return false;

      // nested field value
      for (const field in o1) {
        if (!compare(o1[field], o2[field])) return false;
      }
    } else /* basic type */ {
      return o1 === o2;
    }
  } catch (e) {
    return false;
  }
  return true;
};

try {
  cases.forEach(testCase => {
    const tokens = tokenize(testCase.src);
    if (!compare(tokens, testCase.except.tokens)) throw {
      except: testCase.except.tokens, get: tokens, step: 'tokenize',
    };

    const ast = parse(tokens);
    if (!compare(ast, testCase.except.ast)) throw {
      except: testCase.except.ast, get: ast, step: 'parse',
    };

    const code = generate(ast);
    if (!compare(code, testCase.except.code)) throw {
      except: testCase.except.code, get: code, step: 'generate',
    }

    console.log(`pass ${clc.white(testCase.src)} -> ${clc.green(code)}
    `);
  });
} catch (e: any) {
  console.error(`fail ${e.step} ${e.get}`);
  e.stack ?? console.error(e.stack)
  console.error(`
except:
${JSON.stringify(e?.except, undefined, "  ")}

get:
${JSON.stringify(e?.get, undefined, "  ")}
  `)
}
