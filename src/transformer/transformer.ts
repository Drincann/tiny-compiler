import { LispAST, LispASTNode } from "../parser/parser";

type CLickAST = ProgramASTNode;
export type CLickASTNode =
  ProgramASTNode
  | CallExpressionASTNode
  | ExpressionStatementASTNode
  | NumberLiteralASTNode
  | StringLiteralASTNode
  | IdentifierLiteralASTNode;
interface ProgramASTNode {
  type: 'Program';
  body: Array<ExpressionStatementASTNode>;
}
interface ExpressionStatementASTNode {
  type: 'ExpressionStatement';
  expression: CallExpressionASTNode;
}
interface CallExpressionASTNode {
  type: 'CallExpression';
  callee: IdentifierLiteralASTNode;
  arguments: Array<CLickASTNode>;
}
interface NumberLiteralASTNode {
  type: 'NumberLiteral';
  value: string;
}
interface StringLiteralASTNode {
  type: 'StringLiteral';
  value: string;
}
interface IdentifierLiteralASTNode {
  type: 'Identifier';
  name: string;
}

type Visitor = (node: LispASTNode, parentNode: LispASTNode, transformedParentNode: CLickASTNode) => CLickASTNode;
const traverse = (ast: LispASTNode, transformedAst: CLickASTNode, visit: Visitor): void => {
  switch (ast.type) {
    case 'Program':
      ast.body.forEach(node => {
        traverse(node, visit(node, ast, transformedAst), visit);
      });
      break;
    case 'CallExpression':
      ast.params.forEach(node => {
        traverse(node, visit(node, ast, transformedAst), visit);
      });
      break;
    case 'NumberLiteral':
    case 'StringLiteral':
      // visit(ast, null);
      break;
    default:
      throw new TypeError(`Unknown AST node type: ${(ast as LispASTNode)?.type}`);
  }
}

export const transform = (ast: LispAST): CLickAST => {
  const transformed: CLickAST = {
    type: 'Program',
    body: [],
  };


  traverse(ast, transformed, (node, parentNode, transformedParentNode) => {
    switch (node.type) {
      case 'CallExpression':
        let expression: ExpressionStatementASTNode | CallExpressionASTNode | null = null;
        if (parentNode.type === 'Program') {
          expression = {
            type: 'ExpressionStatement',
            expression: {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: node.name,
              },
              arguments: [],
            },
          };
          (transformedParentNode as ProgramASTNode).body.push(expression);
          return expression;
        } else if (parentNode.type === 'CallExpression') {
          expression = {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: node.name,
            },
            arguments: [],
          };
          (transformedParentNode as ExpressionStatementASTNode).expression.arguments.push(expression);
          return expression;
        }
        throw new TypeError(`CallExpression literal not allowed in ${parentNode.type}`);
      case 'StringLiteral':
        const clikeStrNode: StringLiteralASTNode = {
          type: 'StringLiteral',
          value: node.value,
        };
        if (transformedParentNode.type === 'ExpressionStatement') {
          transformedParentNode.expression.arguments.push(clikeStrNode);
          return clikeStrNode;
        } else if (transformedParentNode.type === 'CallExpression') {
          transformedParentNode.arguments.push(clikeStrNode);
          return clikeStrNode;
        }
        throw new TypeError(`String literal not allowed in ${transformedParentNode.type}`);
      case 'NumberLiteral':
        const clikeNumNode: NumberLiteralASTNode = {
          type: 'NumberLiteral',
          value: node.value,
        };
        if (transformedParentNode.type === 'ExpressionStatement') {
          transformedParentNode.expression.arguments.push(clikeNumNode);
          return clikeNumNode;
        } else if (transformedParentNode.type === 'CallExpression') {
          transformedParentNode.arguments.push(clikeNumNode);
          return clikeNumNode;
        }
        throw new TypeError(`Number literal not allowed in ${transformedParentNode.type}`);
      default:
        throw new TypeError(`Unknown AST node type: ${(node as LispASTNode)?.type}`);
    }
  });
  return transformed;
};