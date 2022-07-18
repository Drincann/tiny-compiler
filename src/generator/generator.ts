import { CLickASTNode } from "../transformer/transform";

export const generate = (ast: CLickASTNode): string => {
  switch (ast.type) {
    case 'Program':
      return ast.body.map(generate).join();
    case 'ExpressionStatement':
      return `${generate(ast.expression)};`;
    case 'CallExpression':
      return `${generate(ast.callee)}(${ast.arguments.map(generate).join(',')})`
    case 'NumberLiteral':
      return ast.value;
    case 'StringLiteral':
      return ast.value;
    case 'Identifier':
      return ast.name;

  }
}