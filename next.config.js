/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "olive-secure-gayal-534.mypinata.cloud",
                port: "",
                pathname: "/**"
            },
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**"
            },
            { protocol: 'https', hostname: 'api.dicebear.com' },
      { protocol: 'https', hostname: 'unavatar.io' },
        ]
    }
};

export default config;
