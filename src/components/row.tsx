import dayjs from 'dayjs'
import { Text, Box } from 'ink'
import React from 'react'
import { ScreenSizeType } from '../lib/useScreenSize.js'

type Props = {
	fkey: number
	sender: string
	subject: string
	date: Date
    highlight?: boolean
	action: 'archive'|'delete'|null
	screenSize: ScreenSizeType
}

export default function Row(p: Props) {
	const keyMap = {
		archive: 'a',
		delete: 'd'
	}
	
	let subjectLength = p.subject.length
	let subject = p.subject.slice(0, p.screenSize.width - (p.sender.length + 12))
	subject.length != subjectLength && (subject = subject + '...')

	

	return (
		<Box flexDirection='row'>
			<Box flexShrink={1}>
				<Text>{displayDate(p.date)}</Text>
				<Text>  </Text>
				<Text backgroundColor='grey'>{p.sender.trim() || '???'}</Text>
			</Box>
			<Box flexWrap='nowrap'>
				<Text>  </Text>
				<Text backgroundColor={p.highlight ? 'green' : ''}>
					{p.action == null ? subject : `Press ${keyMap[p.action]} again to confirm ${p.action}`}
				</Text>
			</Box>
		</Box>
	)
}

function displayDate(rawDate: Date): string {
	let formatDateString = 'MM-DD'
	let formatTimeString = 'HH:mm'
	let date = dayjs(rawDate)
	let formattedDate = date.format(formatDateString)
	if (formattedDate != dayjs().format(formatDateString)) {
		return formattedDate
	}
	else {
		return date.format(formatTimeString)
	}
}