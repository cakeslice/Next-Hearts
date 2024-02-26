const nextJest = require('next/jest.js')

const createJestConfig = nextJest({
	dir: './',
})

/** @type {import('jest').Config} */
module.exports = createJestConfig({
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	testEnvironment: 'jsdom',
	preset: 'ts-jest',
	moduleDirectories: ['node_modules', 'src'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
})
