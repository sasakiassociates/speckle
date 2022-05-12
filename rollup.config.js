import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';

import pkg from './package.json'

export default {

    input: 'src/index.ts',

    output: [
        {
            file: pkg.main,
            format: 'cjs',
            sourcemap: true,
            exports: 'auto',
        },
        {
            file: pkg.module,
            format: 'es',
            sourcemap: true
        }
    ],

    plugins: [
        nodeResolve(),
        commonjs(),
        typescript(),
    ]

}
