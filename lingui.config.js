const { formatter } = require('@lingui/format-po')

const locales = ['en-us', 'de']

if (process.env.NODE_ENV !== 'production') {
	locales.push('pseudo')
}

/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
	locales: locales,
	sourceLocale: 'en-us',
	pseudoLocale: 'pseudo',
	catalogs: [
		{
			path: '<rootDir>/src/translations/locales/{locale}',
			include: ['<rootDir>/src'],
		},
	],
	format: formatter({ origins: false }),
}
