const path = require('path');

module.exports = {
  entry: {
    index: path.join(__dirname, 'src', 'front', './index.js'),
  },
  output: {
    path: path.join(__dirname, 'dest', 'front'),
    filename: '[name].bundle.js',
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
};
