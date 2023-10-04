#!/usr/bin/env node
import { exec } from 'child_process'
import { Text, render, useApp } from 'ink'
import meow from 'meow'
import React, { useEffect, useState } from 'react'
import App from './views/app.js'

// @ts-ignore
const cli = meow(
	`
	Usage
	  $ lettr <cmd>

	Commands
		update
			update the app to the latest version from npm

	Options
		--help
			show this help

	Navigation
		[a] - archive a message
		[d] - delete a message
		[o] - open the html version of a message in the browser
		[r] - refresh the message list
		[g+a] - go to the archived message list
		[esc] - return to the main list or clear a command
		[l] - open your account settings in the browser
		[q] - quit the app

	Account
		You can update your account in the browser
			- Subscribe to the pro version
			- Change your username (forwarding address)
			- View and edit your stacks
`,
	{
		importMeta: import.meta,
		flags: {
			name: {
				type: 'string',
			},
		},
	},
)

if (cli.input.at(0) == 'update') {
	render(<Render input={cli.input} />)

}
else {
	render(<App />)
}

function Render({ input }: { input: string[] }) {
	const { exit } = useApp()
	const [msg, setMsg] = useState('Updating...')

	if (input.at(0) == 'update') {
		useEffect(() => {
			exec('npm install -g @lettr/cli', (err, _, stderr) => {
				if (err) {
					console.error(`error: ${err.message}`)
					return
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`)
					return
				}
				setMsg('Successfully updated lettr')
				exit()
				process.exit(0)
			})
		}, [])
		return (
			<Text>{msg}</Text>
		)
	}
	else {
		return <App />
	}
}