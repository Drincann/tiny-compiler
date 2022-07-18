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

const traverse = (ast: LispASTNode, transformedAst: CLickASTNode,
  visit: (node: LispASTNode, parentNode: LispASTNode, transformedAstNode: CLickASTNode) => CLickASTNode): void => {
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
      // visit(ast, null);
      break;
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


  traverse(ast, transformed, (node: LispASTNode, parentNode: LispASTNode, transformedAstNode: CLickASTNode): CLickASTNode => {
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
          (transformedAstNode as ProgramASTNode).body.push(expression);
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
          (transformedAstNode as ExpressionStatementASTNode).expression.arguments.push(expression);
          return expression;
        }
        throw new TypeError(`CallExpression literal not allowed in ${parentNode.type}`);
      case 'StringLiteral':
        const clikeStrNode: StringLiteralASTNode = {
          type: 'StringLiteral',
          value: node.value,
        };
        if (transformedAstNode.type === 'ExpressionStatement') {
          transformedAstNode.expression.arguments.push(clikeStrNode);
          return clikeStrNode;
        } else if (transformedAstNode.type === 'CallExpression') {
          transformedAstNode.arguments.push(clikeStrNode);
          return clikeStrNode;
        }
        throw new TypeError(`String literal not allowed in ${transformedAstNode.type}`);
      case 'NumberLiteral':
        const clikeNumNode: NumberLiteralASTNode = {
          type: 'NumberLiteral',
          value: node.value,
        };
        if (transformedAstNode.type === 'ExpressionStatement') {
          transformedAstNode.expression.arguments.push(clikeNumNode);
          return clikeNumNode;
        } else if (transformedAstNode.type === 'CallExpression') {
          transformedAstNode.arguments.push(clikeNumNode);
          return clikeNumNode;
        }
        throw new TypeError(`Number literal not allowed in ${transformedAstNode.type}`);
      default:
        throw new TypeError(`Unknown AST node type: ${(node as LispASTNode)?.type}`);
    }
  });
  return transformed;
};