/** @type {import('next').NextConfig} */
module.exports = {
	output: 'standalone',
	reactStrictMode: true,
	swcMinify: true,
	transpilePackages: ['@uidotdev', '@heroicons'],
}
