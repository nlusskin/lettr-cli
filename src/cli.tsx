#!/usr/bin/env node
import React from 'react'
import {render} from 'ink'
import meow from 'meow'
import App from './app.js'

// @ts-ignore
const cli = meow(
	`
	Usage
	  $ lettr

	Options
		--

	Examples
	  $ lettr
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

render(<App />)
