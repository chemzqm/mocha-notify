# mocha-notify loader for webpack

## Usage

### Command Line

*Hint*: when using `!` in the bash command line, you must escape it by prepending a `\`

``` text
webpack-dev-server 'mocha-notify!./my-client-tests.js' --options webpackOptions.js
```

``` text
enhanced-require 'mocha-notify!./my-server-tests.js'
```

### webpack.config.js

```js

module.exports = {
    entry: 'mocha-notify!./entry-file.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    }
}
```

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
