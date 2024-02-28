const withPlugins = require('next-compose-plugins')
const withExportImages = require('next-export-optimize-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
module.exports = withPlugins(
	process.env.EXPORT === 'true' ? [withExportImages, withBundleAnalyzer] : [withBundleAnalyzer],
	{
		output: process.env.STANDALONE ? 'standalone' : process.env.EXPORT ? 'export' : undefined,
		reactStrictMode: true,
		swcMinify: true,
		transpilePackages: ['@uidotdev', '@heroicons'],
	}
)
