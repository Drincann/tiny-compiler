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

// traverse the non-leaf nodes
const traverse = (ast: LispASTNode, transformedAst: CLickASTNode, visit: Visitor): void => {
  switch (ast.type) {
    case 'Program':
      ast.body.forEach(node => {
        traverse(
          /* node -> lower parent node */
          node,
          /* transformedAst -> 
            visitor will return a new node transformed from the parent node
            this new node is the root of the transformed AST
          */
          visit(node, ast, transformedAst),
          /* visit -> traverse functino */
          visit
        );
      });
      break;
    case 'CallExpression':
      ast.params.forEach(node => {
        traverse(node, visit(node, ast, transformedAst), visit);
      });
      break;
    case 'NumberLiteral':
    case 'StringLiteral':
      // this is a leaf node
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
          // ExpressionStatement only exists in Program node in our compiler
          // so for the CallExpression node from the Lisp AST, wo neet to wrap it in an ExpressionStatement
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
        const clikeNode: StringLiteralASTNode = {
          type: 'StringLiteral',
          value: node.value,
        };
        // leaf node is possibly in ExpressionStatement or CallExpression
        if (transformedParentNode.type === 'ExpressionStatement') {
          transformedParentNode.expression.arguments.push(clikeNode);
          return clikeNode;
        } else if (transformedParentNode.type === 'CallExpression') {
          transformedParentNode.arguments.push(clikeNode);
          return clikeNode;
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