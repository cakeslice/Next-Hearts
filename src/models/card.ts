export const cardsList = [
	'10_of_clubs',
	'10_of_diamonds',
	'10_of_hearts',
	'10_of_spades',
	'2_of_clubs',
	'2_of_diamonds',
	'2_of_hearts',
	'2_of_spades',
	'3_of_clubs',
	'3_of_diamonds',
	'3_of_hearts',
	'3_of_spades',
	'4_of_clubs',
	'4_of_diamonds',
	'4_of_hearts',
	'4_of_spades',
	'5_of_clubs',
	'5_of_diamonds',
	'5_of_hearts',
	'5_of_spades',
	'6_of_clubs',
	'6_of_diamonds',
	'6_of_hearts',
	'6_of_spades',
	'7_of_clubs',
	'7_of_diamonds',
	'7_of_hearts',
	'7_of_spades',
	'8_of_clubs',
	'8_of_diamonds',
	'8_of_hearts',
	'8_of_spades',
	'9_of_clubs',
	'9_of_diamonds',
	'9_of_hearts',
	'9_of_spades',
	'ace_of_clubs',
	'ace_of_diamonds',
	'ace_of_hearts',
	'ace_of_spades',
	'jack_of_clubs',
	'jack_of_diamonds',
	'jack_of_hearts',
	'jack_of_spades',
	'king_of_clubs',
	'king_of_diamonds',
	'king_of_hearts',
	'king_of_spades',
	'queen_of_clubs',
	'queen_of_diamonds',
	'queen_of_hearts',
	'queen_of_spades',
] as const

export type Card = (typeof cardsList)[number]

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array: string[]) {
	for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1))
		var temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}
}
export const getShuffledCards = () => {
	const cards = JSON.parse(JSON.stringify(cardsList))
	shuffleArray(cards)
	return cards
}

export const sortCards = (cards: Card[]) =>
	cards.sort((a, b) => {
		const aName =
			a.split('_')[2].replace('hearts', 'zhearts') +
			a.replace('queen', 'k0_queen').replace('10_', 'j0_10_').replace('ace_', 'z0_ace_')
		const bName =
			b.split('_')[2].replace('hearts', 'zhearts') +
			b.replace('queen', 'k0_queen').replace('10_', 'j0_10_').replace('ace_', 'z0_ace_')

		return aName > bName ? 1 : -1
	})
