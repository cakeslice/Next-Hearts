import { InputProps, Input as NInput } from '@nextui-org/react'
import debounce from 'lodash/debounce'
import { memo } from 'react'

type Props = Omit<InputProps, 'onChange'> & {
	debounced?: boolean
	debounceTime?: number
	onChange?: (e?: string) => void
}

export const Input = memo(function Input({
	debounced,
	debounceTime = 200,
	children,
	onChange,
	...props
}: Props) {
	const debouncedChange = debounce((value?: string) => {
		if (debounced) onChange?.(value)
	}, debounceTime)

	return (
		<NInput
			{...props}
			onChange={(e) => {
				if (onChange) {
					if (debounced) {
						debouncedChange(e.currentTarget.value)
					} else {
						onChange(e.currentTarget.validationMessage)
					}
				}
			}}
		>
			{children}
		</NInput>
	)
})
