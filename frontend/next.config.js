// next.config.js
const nextTranslate = require('next-translate-plugin');  // Updated package

module.exports = nextTranslate({
  reactStrictMode: true,
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  optimizeFonts: false,
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'de',
    localeDetection: false,
  },
  async headers() {
    return [
      {
        source: '/about',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
});
