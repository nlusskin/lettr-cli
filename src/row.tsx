import React from 'react'
import { Text, Box } from 'ink'

type Props = {
	title: string
    highlight?: boolean
	action: 'a'|'d'|null
}

export default function Row({title, highlight, action}: Props) {
	const actionMap = {
		a: 'archive',
		d: 'delete'
	}
	return (
		<Box>
			<Text backgroundColor={highlight ? 'green' : ''}>
				{action == null ? title : `Press ${action} again to confirm ${actionMap[action]}`}
			</Text>
		</Box>
	)
}
