import { AppContext } from './appContext.js'
import React, { useEffect, useState, useContext } from 'react'
import { Text, Box, useInput } from 'ink'
import Row from './row.js'
import Read from './read.js'
import { fetchMessageList, MessageType } from './api.js'


export default function List() {
    const { appContext, setAppContext } = useContext(AppContext)
    const [focus, setFocus] = useState(0)

    useInput((input, key) => {
        if (key.return) {
            setAppContext({ read: items[focus] })
        }

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

    const [items, setItems] = useState([] as MessageType[])
	useEffect(() => {
		(async () => {
			let listResponse = await getItems()
			setItems(listResponse)
		})()
	}, [])

    if (!items || items.length == 0) {
        return (
            <Text>When you get your first email it will show up here</Text>
        )
    }

	return (
		<>
            { !appContext.read && <Box flexDirection='column'>
                <Text>{'Hi, ' + appContext.user.user.email}</Text>
                {items.map((v,i) => <Row title={v.subject} key={i} highlight={focus == i} />)}
            </Box>
            }
            { appContext.read && <Read /> }
        </>
	)
}

async function getItems(cursor=0) {
    if (cursor != 0) return [] as MessageType[]
    let msgs = await fetchMessageList()
    return msgs.data
}
