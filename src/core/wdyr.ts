import whyDidYouRender from '@welldone-software/why-did-you-render'
import { enableRenderPerformanceDebugging } from 'config'
import React from 'react'

if (process.env.NODE_ENV === 'development' && enableRenderPerformanceDebugging) {
	whyDidYouRender(React, {
		trackAllPureComponents: true,
		logOnDifferentValues: true,
		include: [/./],
	})
}
