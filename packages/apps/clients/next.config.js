const withTM = require('next-transpile-modules')(['@wimet/apps-shared']);

module.exports = withTM({
  images: {
    domains: [
      'localhost',
      'wimet-strapi.s3.sa-east-1.amazonaws.com',
      'wimet-locations.s3.us-west-2.amazonaws.com',
      'wimet-prod.s3.us-west-2.amazonaws.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/fonts/(.*)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  compiler: {
    styledComponents: true,
  },
});
