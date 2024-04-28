import typescript from '@rollup/plugin-typescript';

const RollupConfig = [{
    input: 'src/index.ts',  // Tu archivo de entrada
    external: id => id.indexOf('node_modules') >= 0,
    output: {
        file: 'lib-es/bundle.js',  // Salida del bundle
        format: 'es',  // Formato CommonJS, adecuado para Node.js
        sourcemap: true,
    },
    plugins: [
        typescript(), // Usa el plugin de TypeScript
    ]
},
{
    input: 'src/index.ts',  // Tu archivo de entrada
    external: id => id.indexOf('node_modules') >= 0,
    output: {
        file: 'lib-cjs/bundle.cjs',  // Salida del bundle
        format: 'cjs',  // Formato CommonJS, adecuado para Node.js
        sourcemap: true,
    },
    plugins: [
        typescript(), // Usa el plugin de TypeScript
    ]
}
]

export default RollupConfig
