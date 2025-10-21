declare module 'next-pwa' {
    import { NextConfig } from 'next';

    interface PWAOptions {
        dest?: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        buildExcludes?: string[];
        publicExcludes?: string[];
        fallbacks?: Record<string, string>;
        cacheOnFrontEndNav?: boolean;
        aggressiveFrontEndNavCaching?: boolean;
        reloadOnOnline?: boolean;
        swcMinify?: boolean;
        workboxOptions?: any;
    }

    function withPWA(options?: PWAOptions): (config: NextConfig) => NextConfig;

    export = withPWA;
}