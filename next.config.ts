import type { NextConfig } from 'next';

const config: NextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    output: 'standalone',
    trailingSlash: false,
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost', port: '5000' },
        ],
    },
    typedRoutes: false,
    compress: true,
};

export default config;
