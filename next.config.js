/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    URL: process.env.URL,

    MONGODB_URL: process.env.MONGODB_URL,
    GOOGLEMAPS_KEY: process.env.GOOGLEMAPS_KEY,
    CLOUDINARY_URL: process.env.CLOUDINARY_URL,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,

    GOOGLEOAUTH_ID: process.env.GOOGLEOAUTH_ID,
    GOOGLEOAUTH_SECRET: process.env.GOOGLEOAUTH_SECRET,
    JWT_SECRET: process.env.JWT_SECRET,
    PAYPAL_ID: process.env.PAYPAL_ID,

    EMAILJS_SERVICE: process.env.EMAILJS_SERVICE,
    EMAILJS_TEMPLATE: process.env.EMAILJS_TEMPLATE,
    EMAILJS_PUBLICKEY: process.env.EMAILJS_PUBLICKEY
  }
}

module.exports = nextConfig
