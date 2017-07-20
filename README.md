# copy-webpack-externals-manifest

Webpack plugin for copy externals assets to output and write to manifest

## Installation

```npm install --save-dev copy-webpack-externals-manifest```

## Usage

```
const CopyWebpackExternalsManifest = require('copy-webpack-externals-manifest')
new CopyWebpackExternalsManifest([Object])
```

### properties

```
{
  module: "moment",
  entry: ["min/moment.min.js"],
  export: {
    root: "moment",
    commonjs2: 'moment'
  },
  assets:["locale/**/*"] //not required
}
```

| Key | Required | Details |
| --- | --- | --- |
| module | Y | "moment" |
| entry | Y | "moment/min/moment.min.js" or ["moment/min/moment.js", ...]  |
| export | Y | just see [webpack externals](https://webpack.js.org/configuration/externals/) |
| assets | N | [copy-webpack-plugin -> from](https://github.com/kevlened/copy-webpack-plugin#pattern-properties) , will not append to manifest.json |


