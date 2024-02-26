const withExportImages = require('next-export-optimize-images')

/** @type {import('next').NextConfig} */
module.exports = withExportImages({
	output: 'standalone', // undefined for default, 'export' for static sites, 'standalone' for custom server
	reactStrictMode: true,
	swcMinify: true,
	transpilePackages: ['@uidotdev', '@heroicons'],
	eslint: {
		// TODO: Remove after fixing the eslint issue
		ignoreDuringBuilds: true,
	},
})
