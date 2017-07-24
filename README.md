# copy-webpack-externals-manifest

Webpack plugin for copy externals assets to output and write to manifest

## Installation

```npm install --save-dev copy-webpack-externals-manifest```

## Usage

```
const CopyWebpackExternalsManifest = require('copy-webpack-externals-manifest')
new CopyWebpackExternalsManifest({
    externals: [Object],
    fileName: String, //default:"manifest.json"
    chunksOrder: Array, //default: ["manifest", "vendor"]
})
```

### externals properties

```
{
  module: "moment",
  entry: ["min/moment.min.js"],
  export: {
    root: "moment",
    commonjs2: 'moment'
  },
  assets:["locale"] //optional
}
```

| Key | Required | Details |
| --- | --- | --- |
| module | Y | "moment" |
| entry | Y | `String` `Array`"moment/min/moment.min.js" or ["moment/min/moment.js", ...]  |
| export | Y | [webpack externals](https://webpack.js.org/configuration/externals/) |
| assets | N | `Array`, Directory or file, [copy-webpack-plugin](https://github.com/kevlened/copy-webpack-plugin#pattern-properties) |


### manifest.json

```
{
  "externals": {
    "moment/min/moment.min.js": "cdn://moment/2.18.1/min/moment.min.js"
  },
  "chunks": {
    "manifest.js": "cdn://manifest.js",
    "vendor.js": "cdn://vendor.js",
    ...
  }
}
```