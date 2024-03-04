import { msg } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Select, SelectItem } from '@nextui-org/react'
import { useRouter } from 'next/router'
import { memo } from 'react'
import { LOCALES, languages } from 'translations/languages'

export const LangSwitcher = memo(function LangSwitcher() {
	const router = useRouter()
	const { i18n } = useLingui()

	function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
		const locale = event.target.value as LOCALES

		router.push(router.pathname, router.pathname, { locale }).then(() => router.reload())
	}

	return (
		<Select
			aria-label='Language switcher'
			className='w-[115px]'
			classNames={{
				trigger: 'd-input-primary',
			}}
			onChange={handleChange}
			defaultSelectedKeys={[router.locale || '']}
		>
			{languages.map((l) => {
				return (
					<SelectItem value={l.locale} key={l.locale}>
						{i18n._(
							languages.find((lang) => lang.locale === l.locale)?.msg || msg`English`
						)}
					</SelectItem>
				)
			})}
		</Select>
	)
})
