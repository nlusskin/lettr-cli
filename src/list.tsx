import { Box, Newline, Spacer, Text, useInput } from 'ink'
import open from 'open'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { MessageType, archiveMessage, deleteMessage, fetchMessageList } from './api.js'
import { AppContext } from './appContext.js'
import Read from './read.js'
import Row from './row.js'
import { useScreenSize } from './useScreenSize.js'
import { useClear } from './useClear.js'

export default function List() {
    const { appContext, setAppContext } = useContext(AppContext)
    const [focus, setFocus] = useState(0)
    const [view, setView] = useState(null as typeof onAction)
    const [onAction, setAction] = useState(null as 'a'|'d'|'g'|null)
    const screenSize = useScreenSize(); screenSize
    // @ts-ignore
    const clear = useClear()
    const tags = {
        a: 'archived',
        d: 'deleted',
        g: ''
    }

    const [items, setItems] = useState([] as MessageType[])
    const refreshMessageList = useCallback(async (tag?: Parameters<typeof fetchMessageList>[0]) => {
        let msgs = await fetchMessageList(tag)
        setItems(msgs.data)
    }, [items, setItems])

	useEffect(() => {
		(async () => {
            // @TODO: make this dynamic
			await refreshMessageList(tags[view!] as 'archived')
		})()
	}, [view])

    function removeCurrentFocusFromList() {
        let newItemList = [...items]
        delete newItemList[focus]
        setItems(newItemList)
        setAction(null)
        setFocus(focus - 1)
    }

    useInput((input, key) => {
        if (key.escape) {
            setAppContext({ read: null })
            //clear()
            setView(null)
        }

        if (key.return) {
            setAction(null)
            setAppContext({ read: items[focus] })
        }

        if (key.downArrow) {
            setAction(null)
            if (focus < items.length - 1) {
                setFocus(focus + 1)
            }
        }
        if (key.upArrow) {
            setAction(null)
            if (focus > 0) {
                setFocus(focus - 1)
            }
        }

        switch(input) {
            case 'a':
                if (onAction == 'g') {
                    setView('a')
                    setAction(null)
                }
                else if (onAction == 'a') {
                    archiveMessage(items[focus]!.id)
                    removeCurrentFocusFromList()
                }
                else {
                    setAction('a')
                }
                break
            case 'd':
                if (onAction == 'd') {
                    deleteMessage(items[focus]!.id)
                    removeCurrentFocusFromList()
                }
                else {
                    setAction('d')
                }
                break
            case 'g':
                setAction('g')
                break
            case 'o':
                let signedUrl = btoa(items[focus]!.htmlSignedUrl)
                open(process.env['BASE_URL']! + '/view?m=' + signedUrl)
                break
            case 'r':
                refreshMessageList()
                break
            case 'q':
                break
        }
    })

	return (
		<Box flexDirection='column' flexGrow={1}>
            { !appContext.read && <Box flexDirection='column'>
                <Text>{'Hi, ' + appContext.user.user.email}</Text>
                <Newline />
                {!items || items.length == 0 &&
                <Text>When you get your first email it will show up here</Text>}

                {items.map((v,i) => 
                    <Row
                        title={v.subject}
                        key={i}
                        highlight={focus == i}
                        action={focus == i ? onAction as 'a' | 'd' : null}
                    />)}
            </Box>
            }
            { appContext.read != null && <Read /> }
            <Newline />
            <Spacer />
            <Box width='100%' flexDirection='row' flexGrow={1} columnGap={4}>
                <Text
                    backgroundColor='magenta'
                >
                    { [
                        '[a]rchive   ',
                        '[d]elete   ',
                        '[o]pen in browser   ',
                    ].map(a => <Text key={a}>{a}</Text>) }
                    { appContext.read != null && <Text>[esc] return to list   </Text>}
                    { appContext.read == null && <Text>[r]efresh   </Text>}
                    <Text>[^-c]quit]</Text>
                </Text>
            </Box>
        </Box>
	)
}
