#!/usr/bin/env node
import { exec } from 'child_process'
import { Text, render, useApp } from 'ink'
import meow from 'meow'
import React, { useEffect, useState } from 'react'
import App from './app.js'

// @ts-ignore
const cli = meow(
	`
	Usage
	  $ lettr <cmd>

	Options
		--

	Examples
	  $ lettr
	  	run the app
	  $ lettr update
	  	update the app to the latest version on npm
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