const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')

function CopyWebpackExternalsManifest(options) {

    this.externalsAssets= [];
    this.externals = {};

    options.forEach(item => {
        // externals
        this.externals[item.module] = item.export;

        // get version
        let version = require(`${item.module}/package.json`).version;

        this.externalsAssets.push(Object.assign(item, {version: version}));
    })
};

WebpackExternalsCopyPlugin.prototype.apply = function (compiler) {
    // assign webpack config externals
    compiler.options.externals = (typeof compiler.options.externals === 'object')
        ? Object.assign(compiler.options.externals, this.externals)
        : this.externals;

    let copyAssets = [];
    let externalsManifest = {};
    this.externalsAssets.forEach(item => {
        let fromDir = `node_modules/${item.module}/`;
        let toDir = `${compiler.options.output.path}/${item.module}/${item.version}/`;

        // copy entry
        if(typeof item.entry === "string"){
            copyAssets.push({
                from: fromDir + item.entry,
                to: toDir + item.entry
            });
            externalsManifest[item.entry] = `${item.module}/${item.version}/${item.entry}`;
        }else if(Array.isArray(item.entry)){
            item.entry.forEach(entry => {
                copyAssets.push({
                    from: fromDir + entry,
                    to: toDir + entry
                });
                externalsManifest[entry] = `${item.module}/${item.version}/${entry}`;
            })
        }

        // copy assets
        if (Array.isArray(item.assets)) {
            let subjectAssets = item.assets.map(entry => ({
                from: fromDir + entry,
                to: toDir + entry
            }));
            this.assetsToCopy.push(...subjectAssets);
        }
    });

    new CopyWebpackPlugin(copyAssets).apply(compiler);

    // output manifest
    new WebpackAssetsManifest({
        assets: externalsManifest,
        writeToDisk: true,
        publicPath: true,
        sortManifest: false
    }).apply(compiler)
};

module.exports = CopyWebpackExternalsManifest;
