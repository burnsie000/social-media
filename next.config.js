/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "yhjqzdermadrwrgecbcc.supabase.co"
        ]
    },
    experimental: {
        ppr: true,
    }
}

module.exports = nextConfig
