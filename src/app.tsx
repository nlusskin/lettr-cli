import 'dotenv/config'
import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { AppContext, AppContextType } from './appContext.js'
import Login from './login.js'
import List from './list.js'
import { getUser } from './api.js'

export default function App() {
	const [appContext, _setAppContext] = useState({} as AppContextType)

	function setAppContext(new_ctx: Partial<AppContextType>) {
		let ex_ctx = { ...appContext }
		Object.assign(ex_ctx, new_ctx)
		_setAppContext(ex_ctx)
		return new_ctx
	}

	useEffect(() => {
		setAppContext({ loading: true })
		getUser().then(async data => {
			if (data.data.session) {
				setAppContext({ user: data.data.session, loading: false })
			}
			else {
				setAppContext({ loading: false })
			}
		})
	}, [])

	return (
		<AppContext.Provider value={{ appContext, setAppContext }}>
			<Box>
				{ appContext.loading && <Text>...</Text>}
				{ !appContext.loading && !appContext.user && <Login /> }
				{ appContext.user && <List /> }
			</Box>
		</AppContext.Provider>
	)
}
