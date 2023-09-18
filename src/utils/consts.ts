import { ModalProps } from '@nextui-org/react'

export const maxCardsHandRowMobile = 7

export const playedCardSizeRatio = 0.85
export const handCardVisibleRatio = 0.33

const cardSize = 17.5
const cardSizeMobileRatio = 0.85

export const getCardSize = (desktop: boolean) => cardSize * (desktop ? 1 : cardSizeMobileRatio)

export const highlightColor = '130, 201, 30'
export const highlightColorBright = '165, 255, 38'

export const modalProps: Partial<ModalProps> = {
	backdrop: 'opaque',
	classNames: {
		backdrop: 'backdrop-blur-sm backdrop-opacity-100 bg-transparent',
	},
	isDismissable: false,
	placement: 'center',
	hideCloseButton: true,
	isKeyboardDismissDisabled: true,
}
