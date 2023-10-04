import '../lib/env.js'
import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { AppContext, AppContextType } from '../lib/appContext.js'
import Login from './login.js'
import List from './list.js'
import { getUser } from '../api/api.js'
import Profile from '../components/profile.js'
import Read from './read.js'

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
		let appVersion = process.env['APP_VERSION']!
		fetch(process.env['NPM_PACKAGE_URL']!).then(async data => {
			let { version: releaseVersion } = await data.json()
			if (appVersion != releaseVersion && appVersion != 'dev') {
				console.log(`Update available (${appVersion} → ${releaseVersion})`)
				console.log('Update by running `lettr update`')
			}
		})
		getUser().then(async data => {
			if (data.data.session) {
				setAppContext({ user: data.data.session, loading: false })
			}
			else {
				setAppContext({ loading: false })
			}
		})
	}, [])

	const router = {
		loading: appContext.loading,
		login: !appContext.loading && !appContext.user,
		profile: !appContext.loading && !appContext.read && appContext.user,
		list: !appContext.loading && !appContext.read && appContext.profile,
		read: appContext.read
	}

	return (
		<AppContext.Provider value={{ appContext, setAppContext }}>
			{appContext.unmount && <></>}
			{!appContext.unmount && 
				<Box flexDirection='column'>
					{ router.loading && <Text>...</Text>}
					{ router.login && <Login /> }
					{ router.profile && <Profile /> }
					{ router.list && <List /> }
					{ router.read && <Read  /> }

				</Box>
			}
		</AppContext.Provider>
	)
}
