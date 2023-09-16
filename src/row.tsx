import React from 'react'
import { Text, Box } from 'ink'

type Props = {
	title: string
    highlight?: boolean
}

export default function Row({title, highlight}: Props) {
	return (
		<Box>
			<Text backgroundColor={highlight ? 'green' : ''}>{title}</Text>
		</Box>
	)
}
