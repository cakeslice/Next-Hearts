const withPlugins = require('next-compose-plugins')
const withExportImages = require('next-export-optimize-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withPlugins(
	process.env.EXPORT === 'true' ? [withExportImages, withBundleAnalyzer] : [withBundleAnalyzer],
	{
		output: process.env.EXPORT ? 'export' : 'standalone', // undefined for default, 'export' for static sites, 'standalone' for custom server
		reactStrictMode: true,
		swcMinify: true,
		transpilePackages: ['@uidotdev', '@heroicons'],
		eslint: {
			// TODO: Remove after fixing the eslint issue
			ignoreDuringBuilds: true,
		},
	}
)
