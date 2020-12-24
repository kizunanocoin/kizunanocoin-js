import autoExternal from 'rollup-plugin-auto-external'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import license from 'rollup-plugin-license'

import pkg from './package.json'

const ENV = process.env.NODE_ENV

const LICENSE_BANNER = `
/*!
* kizunanocoin-js v${pkg.version}: A toolkit for KIZUNANO COIN.
* Copyright (c) <%= moment().format('YYYY') %> THE KIZUNANO CORP. <info at kizunanocoin dot com>
* Licensed under GPL-3.0 (https://git.io/vAZsK)
*/
`.trim()

const outputs = [
  {
    name: 'kizunanocoin',
    file: 'dist/kizunanocoin.umd.js',
    format: 'umd',
  },
  { file: pkg.main, format: 'cjs' },
  { file: pkg.module, format: 'es' },
]

const configs = outputs.map((output, index) => {
  const config = {
    input: 'src/index.ts',
    output,
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        useTsconfigDeclarationDir: true,
        tsconfigOverride: { compilerOptions: { declaration: index === 0 } }, // only generate definitions once, otherwise crash
      }),
      autoExternal({
        dependencies: output.format !== 'umd',
      }),
    ],
  }

  if (ENV === 'production') {
    config.plugins.push(terser())

    config.plugins.push(
      license({
        banner: LICENSE_BANNER,
      })
    )
  }

  return config
})

export default configs
