module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/,
        use: [
          {
            loader: 'responsive-loader',
            options: {
              adapter: require('responsive-loader/sharp'),
              sizes: [320, 640, 960, 1200, 1800],
              placeholder: true,
              placeholderSize: 40,
              quality: 85,
              name: 'images/[name]-[width].[ext]'
            }
          }
        ]
      }
    ]
  }
};