function getRandomInt(min: number, max: number) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1) + min) // The maximum is inclusive and the minimum is inclusive
}
type Sound = 'play' | 'turn_end' | 'got_cards' | 'break' | 'secret'
export const playSound = (sound: Sound) => {
	let name: string = sound
	if (sound === 'play') name = 'play' + getRandomInt(1, 5)
	if (sound === 'turn_end') name = 'turn_end' + getRandomInt(1, 3)

	const s = new Audio(`https://cloud.cakeslice.dev/open-hearts/${name}.mp3`)
	s.volume = sound === 'break' ? 0.5 : 1
	s.play()
}
