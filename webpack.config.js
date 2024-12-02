const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust the entry point as needed
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.join(__dirname, 'portfolio'), // Serve from 'portfolio' directory
    compress: true,
    port: 8080,
  },
  // ... other configurations ...
}; 