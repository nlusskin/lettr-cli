import { AppContext } from '../lib/appContext.js'
import React, { useEffect, useState, useContext } from 'react'
import { Box, Text, useInput,  } from 'ink'
import { useScreenSize } from '../lib/useScreenSize.js'
//import { marked } from 'marked'
//import TerminalRenderer from 'marked-terminal'

export default function Read() {
    const { appContext, setAppContext } = useContext(AppContext)
	const screenSize = useScreenSize()

	const [renderedText, setRenderedText] = useState(['...'])
	const [slice, setSlice] = useState(0)
	const [text, setText] = useState([''])
    // @ts-ignore
    //marked.setOptions({ renderer: new TerminalRenderer() })

	useEffect(() => {
		(async () => {
            if (!appContext.read) return
			if (!appContext.read.textSignedUrl && appContext.read.htmlSignedUrl) {
				setText(['This message was not delivered with a text version. To read in html, press \'o\''])
				return
			}
			let res = await fetch(appContext.read.textSignedUrl)
            let rawText = await res.text()
			rawText = rawText.replaceAll(/(^\W+[\n\r]){2,}|[\n\r]{3,}/gm, '\n\n')
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
				if (word.search(/\n+/g) > -1) {
					lines.push(word)
					continue
				}
				if (wc + words[idx + 1]!.length >= screenSize.width - 8) {
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
		let buffer = 12
		setRenderedText(text.slice(slice, screenSize.height - buffer + slice))
	}, [text, slice])

	
	useInput((_, key) => {
		if (key.escape) {
            setAppContext({ read: null })
        }
        if (key.downArrow) {
            if (slice < text.length - screenSize.height) {
                setSlice(slice + 1)
            }
        }
        if (key.upArrow) {
            if (slice > 0) {
                setSlice(slice - 1)
            }
        }
	})

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