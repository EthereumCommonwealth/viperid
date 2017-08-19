module.exports = {
  webpack: (config, { dev }) => {
    config.module.rules.push({
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    });
    return config;
  },
  exportPathMap: function() {
    return {
      '/': { page: '/' }
    };
  }
};
