import React, { useEffect, useState } from 'react'
import { Box, useInput } from 'ink'
import Row from './row.js'


export default function List() {
    const [focus, setFocus] = useState(0)

    useInput((input, key) => {
        if (key.downArrow) {
            if (focus < items.length - 1) {
                setFocus(focus + 1)
            }
        }
        if (key.upArrow) {
            if (focus > 0) {
                setFocus(focus - 1)
            }
        }

        switch(input) {
            case 'a':
                'archive'
                break
            case 'd':
                'delete'
                break
            case 'o':
                'open'
                break
        }
    })

    const [items, setItems] = useState([] as ListItemType[])
	useEffect(() => {
		(async () => {
			let listResponse = await getItems()
			setItems(listResponse)
		})()
	}, [])

	return (
		<Box flexDirection='column'>
			{items.map((v,i) => <Row title={v.title} key={i} highlight={focus == i} />)}
		</Box>
	)
}

async function getItems(cursor=0) {
    if (cursor != 0) return [] as ListItemType[]

    return [
        {
            title: 'Sample title 1',
            link: 'https://'
        },
        {
            title: 'Sample title 2',
            link: 'https://'
        },
        {
            title: 'Sample title 3',
            link: 'https://'
        }
    ] as ListItemType[]
}

type ListItemType = {
    title: string
    link: string
}
