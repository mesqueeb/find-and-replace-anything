module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.ts',
      'dist/**/*.js'
    ],
    tests: [
      'test/**/*.js'
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    compilers: {
      // '**/*.+(js|ts)': wallaby.compilers.typeScript({allowJs: true, outDir: './bin'})
      '+(src|test)/**/*.js': wallaby.compilers.babel({
        presets: ['@babel/preset-env', '@ava/babel-preset-stage-4'],
        plugins: ['@babel/plugin-proposal-object-rest-spread']
      })
    },
    // preprocessors: {
    //   '**/*.jsts': file => file.changeExt('js').content
    // },
    testFramework: 'ava',
    debug: true
  }
}
