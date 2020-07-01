const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

function CopyWebpackExternalsManifest(options) {
    this.externalsAssets = [];
    this.externals = {};
    this.chunksOrder = options.chunksOrder || ["manifest", "vendor"]
    this.fileName = options.fileName || 'manifest.json'

    options.externals.forEach(item => {
        // externals
        this.externals[item.module] = item.export;

        // get version
        let version = require(`${item.module}/package.json`).version;

        this.externalsAssets.push(Object.assign(item, {version: version}));
    })
};

CopyWebpackExternalsManifest.prototype.apply = function (compiler) {
    let _this = this;

    // assign webpack config externals
    compiler.options.externals = (typeof compiler.options.externals === 'object')
        ? Object.assign(compiler.options.externals, _this.externals)
        : _this.externals;

    let copyAssets = [];
    let externalsManifest = {};
    _this.externalsAssets.forEach(item => {
        let fromDir = `node_modules/${item.module}/`;
        let toDir = `${compiler.options.output.path}/${item.module}/${item.version}/`;
        let externalsDir = `${compiler.options.output.publicPath}${item.module}/${item.version}/`

        // copy entry
        if (typeof item.entry === "string") {
            copyAssets.push({
                from: fromDir + item.entry,
                to: toDir + item.entry
            });
            externalsManifest[`${item.module}/${item.entry}`] = `${externalsDir}${item.entry}`;
        } else if (Array.isArray(item.entry)) {
            item.entry.forEach(entry => {
                copyAssets.push({
                    from: fromDir + entry,
                    to: toDir + entry
                });
                externalsManifest[`${item.module}/${entry}`] = `${externalsDir}${entry}`;
            })
        }

        // copy assets
        if (Array.isArray(item.assets)) {
            let subjectAssets = item.assets.map(entry => ({
                from: fromDir + entry,
                to: toDir + entry
            }));
            copyAssets.push(...subjectAssets);
        }
    });

    new CopyWebpackPlugin({patterns : copyAssets}).apply(compiler);

    compiler.plugin("done", function (stats) {
        let chunks = stats.toJson().assetsByChunkName;

        require('fs').writeFileSync(
            path.join(compiler.options.output.path, _this.fileName),
            JSON.stringify(
                {
                    externals: externalsManifest,
                    chunks: sortByList(chunks, _this.chunksOrder, compiler.options.output.publicPath)
                }
            )
        );
    });
};

function sortByList(chunks, orderList, publicPath) {
    let chunksManifest = {};
    let orderChunks = {};
    let palceholder = "Meaningless";

    if (Array.isArray(orderList)) {
        orderList.forEach(i => {
            orderChunks[i] = palceholder;
        })
    }

    Object.assign(orderChunks, chunks);

    Object.keys(orderChunks).forEach(chunk => {
        let chunkFile = orderChunks[chunk]

        if (chunkFile === palceholder) {
            return
        }

        if (typeof chunkFile === 'string') {
            chunksManifest[chunk + path.extname(chunkFile)] = publicPath + chunkFile
        } else if (Array.isArray(chunkFile)) {
            chunkFile.forEach(item => {
                chunksManifest[chunk + path.extname(item)] = publicPath + item
            })
        }
    })

    return chunksManifest
}

module.exports = CopyWebpackExternalsManifest;
