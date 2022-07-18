import clc from 'cli-color';
import { compiler } from "./src";
import util from 'util';
import { cases } from './cases';


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
    const tokens = compiler.steps.tokenize(testCase.src);
    if (!compare(tokens, testCase.except.tokens)) throw {
      except: testCase.except.tokens, get: tokens, step: 'tokenize',
    };

    const ast = compiler.steps.parse(tokens);
    if (!compare(ast, testCase.except.ast)) throw {
      except: testCase.except.ast, get: ast, step: 'parse',
    };
    const clikeAst = compiler.steps.transform(ast);
    if (!compare(clikeAst, testCase.except.transformed)) throw {
      except: testCase.except.transformed, get: clikeAst, step: 'transform',
    };

    const code = compiler.steps.generate(clikeAst);
    if (!compare(code, testCase.except.code)) throw {
      except: testCase.except.code, get: code, step: 'generate',
    }

    console.log(`pass \n${clc.white(testCase.src)}\n -> \n${clc.green(code)}\n`);
  });
} catch (e: any) {
  console.error(`fail ${e.step} ${e.except}`);
  !e.stack ?? console.error(e.stack);
  console.error(`
except:
${util.inspect(e.except, { showHidden: false, depth: null, colors: true })}

get:
${util.inspect(e.get, { showHidden: false, depth: null, colors: true })}
  `)
}
