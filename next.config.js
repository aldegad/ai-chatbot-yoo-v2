const { withExpo } = require("@expo/next-adapter");

/** @type {import('next').NextConfig} */
const nextConfig = withExpo({
  reactStrictMode: false,
  transpilePackages: [
    "react-native",
    "expo"
    // Add more React Native / Expo packages here...
  ],
  experimental: {
    forceSwcTransforms: true,
  },
  webpack(config) {
    // nextjs에서 네이티브 페이지 무시
    config.module.rules.push({
      test: /\.native\.tsx?$/,
      use: 'ignore-loader'
    });
    // nextjs svg파일을 tsx파일로 인식해서 보이게 하기
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  }
});

module.exports = nextConfig;
