import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { allCategories } from 'models/company'
import { Filters } from '.'

it('renders all category filters', () => {
	render(<Filters />)

	const categories = allCategories.map((category) => screen.getByText(category))

	for (let i = 0; i < categories.length; i++) {
		expect(categories[i]).toBeInTheDocument()
	}
})

it('renders the search input', () => {
	render(<Filters />)

	const input = screen.getByTestId('dashboard.Filters.Input-search')

	expect(input).toBeInTheDocument()
	expect(input).toBeEnabled()
})
