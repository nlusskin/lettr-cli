import React from 'react'
import { Text, Box } from 'ink'
import { ScreenSizeType } from './useScreenSize.js'

type Props = {
	sender: string
	subject: string
    highlight?: boolean
	action: 'a'|'d'|null
	screenSize: ScreenSizeType
}

export default function Row({sender, subject, highlight, action, screenSize }: Props) {
	const actionMap = {
		a: 'archive',
		d: 'delete'
	}
	
	let subjectLength = subject.length
	subject = subject.slice(0, screenSize.width - (sender.length + 4))
	subject.length != subjectLength && (subject = subject + '...')

	return (
		<Box flexDirection='row'>
			<Box flexShrink={1}>
				<Text backgroundColor='grey'>{sender.trim()}</Text>
			</Box>
			<Box flexWrap='nowrap'>
				<Text>  </Text>
				<Text backgroundColor={highlight ? 'green' : ''}>
					{action == null ? subject : `Press ${action} again to confirm ${actionMap[action]}`}
				</Text>
			</Box>
		</Box>
	)
}
