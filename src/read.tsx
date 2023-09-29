import { AppContext } from './appContext.js'
import React, { useEffect, useState, useContext } from 'react'
import { Box, Text,  } from 'ink'
import { useScreenSize } from './useScreenSize.js'
//import { marked } from 'marked'
//import TerminalRenderer from 'marked-terminal'

export default function Read() {
    const { appContext } = useContext(AppContext)
	const screenSize = useScreenSize()
    // @ts-ignore
    //marked.setOptions({ renderer: new TerminalRenderer() })

    const [text, setText] = useState([''])
    const [renderedText, setRenderedText] = useState(['...'])
	useEffect(() => {
		(async () => {
            if (!appContext.read) return
			if (!appContext.read.textSignedUrl && appContext.read.htmlSignedUrl) {
				setText(['This message was not delivered with a text version. To read in html, press \'o\''])
				return
			}
			let res = await fetch(appContext.read.textSignedUrl)
            let rawText = await res.text()
			const words = rawText.split(/\s/g)
			const lines = []
			
			let wc = 0
			let line = ''
			for (let [idx, word] of words.entries()) {
				
				//console.log('*', word)
				if (idx == words.length - 1) {
					lines.push(line)
					break
				}
				if (wc + words[idx + 1]!.length >= screenSize.width) {
					lines.push(line)
					wc = 0
					line = word + ' '
					continue
				}
				wc += (word.length + 1)
				if (word.length != 0) {
					line += word + ' '
				}
			}
			setText(lines)
		})()
	}, [])

	useEffect(() => {
		let buffer = 8
		setRenderedText(text.slice(0, screenSize.height - buffer))
	}, [text])

	return (
		<Box flexDirection='column'>
            {renderedText.map((t,i) => 
				<Box key={i}>
					<Text>{t}</Text>
					{/* <Newline /> */}
				</Box>
			)}
		</Box>
	)
}