export const cases = [{
  src: `
    (concat (concat "" "a") "bc")
    (add 22 (subtract 4 2))
  `.trim().split('\n').map(line => line.trim()).join('\n'),
  except: {
    tokens: [
      { type: 'paren', value: '(' },
      { type: 'name', value: 'concat' },
      { type: 'paren', value: '(' },
      { type: 'name', value: 'concat' },
      { type: 'string', value: '""' },
      { type: 'string', value: '"a"' },
      { type: 'paren', value: ')' },
      { type: 'string', value: '"bc"' },
      { type: 'paren', value: ')' },
      { type: 'paren', value: '(' },
      { type: 'name', value: 'add' },
      { type: 'number', value: '22' },
      { type: 'paren', value: '(' },
      { type: 'name', value: 'subtract' },
      { type: 'number', value: '4' },
      { type: 'number', value: '2' },
      { type: 'paren', value: ')' },
      { type: 'paren', value: ')' }
    ],
    ast: {
      type: 'Program',
      body: [
        {
          type: 'CallExpression',
          name: 'concat',
          params: [
            {
              type: 'CallExpression',
              name: 'concat',
              params: [
                { type: 'StringLiteral', value: '""' },
                { type: 'StringLiteral', value: '"a"' }
              ]
            },
            { type: 'StringLiteral', value: '"bc"' }
          ]
        },
        {
          type: 'CallExpression',
          name: 'add',
          params: [
            { type: 'NumberLiteral', value: '22' },
            {
              type: 'CallExpression',
              name: 'subtract',
              params: [
                { type: 'NumberLiteral', value: '4' },
                { type: 'NumberLiteral', value: '2' }
              ]
            }
          ]
        }
      ]
    },
    transformed: {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'concat' },
            arguments: [
              {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'concat' },
                arguments: [
                  { type: 'StringLiteral', value: '""' },
                  { type: 'StringLiteral', value: '"a"' }
                ]
              },
              { type: 'StringLiteral', value: '"bc"' }
            ]
          }
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'add' },
            arguments: [
              { type: 'NumberLiteral', value: '22' },
              {
                type: 'CallExpression',
                callee: { type: 'Identifier', name: 'subtract' },
                arguments: [
                  { type: 'NumberLiteral', value: '4' },
                  { type: 'NumberLiteral', value: '2' }
                ]
              }
            ]
          }
        }
      ]
    },
    code: `
      concat(concat("","a"),"bc");
      add(22,subtract(4,2));
    `.trim().split('\n').map(line => line.trim()).join('\n'),
  },
},
];