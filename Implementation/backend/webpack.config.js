const path = require('path');

module.exports = {
  target: 'node', // Specifies the target environment (Node.js)
  entry: './server.js', // Entry point of your backend application
  output: {
    path: path.resolve('/webpackFiles', 'dist'), // Output directory
    filename: 'bundle.js', // Output filename
  },
  mode: 'development',
  module: {
    rules: [
      // Add loaders for handling different file types if needed
      // For example, babel-loader for transpiling JavaScript
    ],
  },
  // Add any additional plugins or configurations as needed
};
