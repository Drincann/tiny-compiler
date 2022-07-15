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
  let currToken = tokenIt.next().value as Token;

  const walk = (): ASTNode => {
    if (currToken.type === 'paren' && currToken.value === '(') {
      // recursively call walk to walk throw the nested node
      // pass the '('
      currToken = tokenIt.next().value;
      // expect the name token
      if (currToken.type !== 'name') throw new TypeError(currToken.type);

      const callExpASTNode = {
        type: 'CallExpression',
        name: currToken.value,
        params: [],
      } as CallExpressionASTNode;
      // pass the name token
      currToken = tokenIt.next().value;

      while (/* begin with the '(' and resolve the token behind it 
                until meet the ')' matching the same level paren */
        !(currToken.type === 'paren' && currToken.value === ')')
      ) {
        if (currToken.type === 'paren' && currToken.value === '(') {
          /* nested call expression */
          callExpASTNode.params.push(walk());
        } else /* other value token */ {
          if (currToken.type === 'number') {
            callExpASTNode.params.push({
              type: 'NumberLiteral',
              value: currToken.value,
            });
          } else if (currToken.type === 'string') {
            callExpASTNode.params.push({
              type: 'StringLiteral',
              value: currToken.value
            });
          }
          // pass the token not nested
          currToken = tokenIt.next().value;
        }
      }
      // pass the ')'
      currToken = tokenIt.next().value;
      return callExpASTNode;
    }

    throw new TypeError(`${currToken.type} ${currToken.value}`);
  };

  const ast: AST = { type: 'Program', body: [], };
  while (currToken) ast.body.push(walk() as CallExpressionASTNode)
  return ast;
};