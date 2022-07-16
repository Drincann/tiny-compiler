import { LispASTNode } from "../parser/parser"

export const generate = (ast: LispASTNode): string => {
  switch (ast.type) {
    case 'Program':
      return ast.body.map(generate).join();
    case 'CallExpression':
      return `${ast.name}(${ast.params.map(generate).join(',')})`
    case 'NumberLiteral':
      return ast.value;
    case 'StringLiteral':
      return ast.value;
  }
}