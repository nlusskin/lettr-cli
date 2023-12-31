import { Box, Newline, Spacer, Text, useInput } from 'ink'
import _ from 'lodash'
import { exec } from 'node:child_process'
import open from 'open'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { archiveMessage, deleteMessage, fetchMessageList, getUser } from '../api/api.js'
import Row from '../components/row.js'
import { AppContext } from '../lib/appContext.js'
import { cacheFile, checkCache, tmpPath } from '../lib/cache.js'
import { useScreenSize } from '../lib/useScreenSize.js'

export default function List() {
    const { appContext, setAppContext } = useContext(AppContext)
    const [loading, setLoading] = useState(false)
    const [focus, setFocus] = useState(appContext.list?.focus ?? 0)
    const [view, setView] = useState('inbox' as 'inbox'|'archived')
    const [onAction, setAction] = useState(null as 'archive'|'delete'|'g'|null)
    const screenSize = useScreenSize()
    const items = appContext.list?.[view] || []

    const refreshMessageList = useCallback(async (tag: typeof view) => {
        setLoading(true)
        let msgs = await fetchMessageList(tag)
        let newCtx = { list: { ...appContext.list, [tag]: msgs.data } }
        setAppContext(newCtx)
        setLoading(false)
    }, [appContext])

    function removeCurrentFocusFromList() {
        let newItemList = [...items]
        _.pullAt(newItemList, [focus])
        setAppContext({ list: { ...appContext.list, [view]: newItemList} })
        setAction(null)
    }

	useEffect(() => {
        if (appContext.list?.[view]) return
		refreshMessageList(view).then()
	}, [view])

    // cache files around the cursor
    useEffect(() => {
        for (var i=0; i<4; i++) {
            if (focus + i > items.length - 1) break
            let { id, htmlSignedUrl = null, textSignedUrl = null } = items[focus + i]!
            let htmlPath = `${id}/msg.html`
            let textPath = `${id}/msg.txt`
            checkCache(htmlPath).then(exists => {
                if (!exists && htmlSignedUrl) {
                    fetch(htmlSignedUrl).then(async d => cacheFile(htmlPath, await d.text()))
                }
            })
            checkCache(textPath).then(exists => {
                if (!exists && textSignedUrl) {
                    fetch(textSignedUrl).then(async d => cacheFile(textPath, await d.text()))
                }
            })
        }
	}, [focus, items])

    useInput((input, key) => {
        if (key.escape) {
            setView('inbox')
            setAction(null)
        }

        if (key.return) {
            setAction(null)
            setAppContext({
                read: appContext.list[view][focus],
                list: { ...appContext.list, focus }
            })
        }

        if (key.downArrow) {
            setAction(null)
            if (focus < items.length - 1) {
                setFocus(focus + 1)
            }
            if (focus == items.length - 1) {
                setFocus(0)
            }
        }
        if (key.upArrow) {
            setAction(null)
            if (focus > 0) {
                setFocus(focus - 1)
            }
            if (focus == 0) {
                setFocus(items.length - 1)
            }
        }

        switch(input) {
            case 'a':
                if (onAction == 'g') {
                    setView('archived')
                    setAction(null)
                    setFocus(0)
                }
                else if (onAction == 'archive') {
                    archiveMessage(items[focus]!.id)
                    removeCurrentFocusFromList()
                }
                else {
                    setAction('archive')
                }
                break
            case 'd':
                if (onAction == 'delete') {
                    deleteMessage(items[focus]!.id)
                    removeCurrentFocusFromList()
                }
                else {
                    setAction('delete')
                }
                break
            case 'g':
                setAction('g')
                break
            case 'i':
                if (onAction == 'g') {
                    setView('inbox')
                }
                break
            case 'l':
                getUser().then(session => {
                    open(process.env['BASE_URL']! + '/auth?t=' + session.data.session?.access_token)
                })
                break
            case 'o':
                let signedUrl = btoa(items[focus]!.htmlSignedUrl)
                open(process.env['BASE_URL']! + '/view?m=' + signedUrl)
                break
            case 'p':
                exec(`qlmanage -p ${tmpPath}/${items[focus]!.id}/msg.html > /dev/null`)
                break
            case 'r':
                refreshMessageList(view)
                break
            case 'q':
                setAppContext({ unmount: true })
                setTimeout(() => process.exit(0), 0)
                break
        }
    })

    if (loading) return (
        <Text>...</Text>
    )

	return (
		<Box flexDirection='column' flexGrow={1}>
            { !appContext.read && <Box flexDirection='column'>
                {!items || items.length == 0 &&
                <Text>When you get your first email, it will show up here</Text>}

                {items && items.map((v,i) => 
                    <Row
                        sender={v.Publication.name || v.Publication.fromEmail}
                        subject={v.subject}
                        date={v.receivedAt}
                        key={i}
                        fkey={i}
                        highlight={focus == i}
                        action={focus == i ? onAction as Exclude<typeof onAction, 'g'> : null}
                        screenSize={screenSize}
                    />)}
            </Box>
            }
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
                    <Text>[q]uit</Text>
                </Text>
            </Box>
        </Box>
	)
}
