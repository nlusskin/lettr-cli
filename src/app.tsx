import 'dotenv/config'
import React, { useEffect, useState } from 'react'
import { Text, Box } from 'ink'
import Login from './login.js'
import List from './list.js'
import { getUser } from './api.js'

type Props = { }

export default function App({}: Props) {
	const [user, setUser] = useState(false as any)
	useEffect(() => {
		getUser().then(data => setUser(data))
	}, [])

	return (
		<Box>
			<Text></Text>
			{ !user && <Login /> }
			{ user && <List /> }
		</Box>
	)
}
