import { AppContext } from './appContext.js'
import React, { useEffect, useState, useContext } from 'react'
import { Box, Text, useInput } from 'ink'
import { marked } from 'marked'
import TerminalRenderer from 'marked-terminal'

export default function Read() {
    const { appContext, setAppContext } = useContext(AppContext)
    // @ts-ignore
    marked.setOptions({ renderer: new TerminalRenderer() })

    useInput((_, key) => {
        if (key.escape) {
            setAppContext({ read: null })
        }
    })

    const [text, setText] = useState('...')
	useEffect(() => {
		(async () => {
            if (!appContext.read) return
			let res = await fetch(appContext.read.textSignedUrl)
			setText(await res.text())
		})()
	}, [])

	return (
		<Box flexDirection='column'>
            <Text>{marked(text)}</Text>
		</Box>
	)
}