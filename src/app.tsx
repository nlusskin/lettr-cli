import React from 'react'
import { Text, Box } from 'ink'
import Login from './login.js'
import List from './list.js'

type Props = { }

const authenticated = true

export default function App({}: Props) {
	return (
		<Box>
			<Text></Text>
			{ !authenticated && <Login /> }
			{ authenticated && <List /> }
		</Box>
	)
}
