/**
 * @see { @link https://github.com/iamvishnusankar/next-sitemap#configuration-options}
 */

const linguiConfig = require('./lingui.config')
const locales = linguiConfig.locales.filter(function (locale) {
	return locale !== 'pseudo'
})

const alternateRefs = locales.map((locale) => ({
	href: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
	hreflang: locale,
}))

const exclude = locales.map((locale) => `/${locale}/404`).concat('/404')

const pathsWithMultipleLocales = locales.flatMap((v, i) => locales.map((w) => `/${v}/${w}/`))

/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
	generateIndexSitemap: false,
	alternateRefs,
	exclude,
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: '*',
				allow: '/',
				disallow: pathsWithMultipleLocales, // e.g. en-us/nl-nl
			},
		],
	},
}
