/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore optional dependencies that cause build issues
    config.resolve.alias = {
      ...config.resolve.alias,
<<<<<<< HEAD
      'fhevmjs': false,
      '@react-native-async-storage/async-storage': false,
      'pino-pretty': false,
=======
      "fhevmjs": false,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
    };

    // Handle WASM files if needed
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    return config;
  },
};

module.exports = nextConfig;

<<<<<<< HEAD

=======
>>>>>>> 5175f1f88449627993d74a1cab7c15099a0d7ac1
