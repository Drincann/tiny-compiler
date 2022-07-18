import { program } from 'commander'
import { compile } from '../compiler';
import { writeFile, readFile } from 'fs/promises'

program.name('lcc').description('LCC compiler').version('0.0.1')
  .argument('<file>', 'source file')
  .option('-o, --out <file>', 'output file', 'out.c')
  .action(async (file, opts) => {
    const src = await readFile(file, 'utf8')
    const code = compile(src)
    await writeFile(opts.out, code)
  }).parse();