import { NameToken, NumberToken, StringToken, Token } from "./tokenizer";

type AST = ProgramASTNode;
type ASTNode =
  CallExpressionASTNode
  | NumberASTNode
  | StringASTNode;
interface ProgramASTNode /* root */ {
  type: 'Program';
  body: Array<CallExpressionASTNode>;
}
interface CallExpressionASTNode /* paren & name token */ {
  type: 'CallExpression';
  name: NameToken['value'];
  params: Array<CallExpressionASTNode | NumberASTNode | StringASTNode>;
}
interface NumberASTNode /* number token */ {
  type: 'NumberLiteral';
  value: NumberToken['value'];
}
interface StringASTNode /* string token */ {
  type: 'StringLiteral';
  value: StringToken['value'];
}


export const parse = (tokens: Token[]): AST => {
  const tokenIt: Iterator<Token> = tokens[Symbol.iterator]()
  let currToken = tokenIt.next().value;

  const walk = (): ASTNode => {
    try {
      if (currToken.type === 'number') {
        return {
          type: 'NumberLiteral',
          value: currToken.value,
        };
      } else if (currToken.type === 'string') {
        return {
          type: 'StringLiteral',
          value: currToken.value
        };
      } else if (currToken.type === 'paren' && currToken.value === '(') {
        // recursively call walk to walk throw the nested node
        currToken = tokenIt.next().value;
        if (currToken.type !== 'name') throw new TypeError(currToken.type);

        const callExpASTNode = {
          type: 'CallExpression',
          name: currToken.value,
          params: [],
        } as CallExpressionASTNode;
        currToken = tokenIt.next().value;
        while (currToken.type !== 'paren' ||
          (currToken.type === 'paren' && currToken.value !== ')')) {
          callExpASTNode.params.push(walk());
        }
        return callExpASTNode;
      }
    } finally {
      currToken = tokenIt.next().value;
    }

    throw new TypeError(currToken.type);
  };

  const ast: AST = { type: 'Program', body: [], };
  while (currToken) ast.body.push(walk() as CallExpressionASTNode)
  return ast;
};