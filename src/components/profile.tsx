import { Text, Box, Newline } from 'ink'
import React, { useEffect, useContext } from 'react'
import { fetchCurrentUser } from '../api/api.js'
import { AppContext } from '../lib/appContext.js'


export default function Profile() {
    const { appContext, setAppContext } = useContext(AppContext)

    useEffect(() => {
        if (appContext.profile) return

        fetchCurrentUser().then(data => {
            setAppContext({ profile: data })
        })
    }, [])

    if (!appContext.profile) return

	return (
		<Box>
			<Text>{'Hi, ' + appContext.profile.email }</Text>
            <Text>  </Text>
			<Text>{'Your forwarding address is: ' + appContext.profile.fwdAddress}</Text>
            <Newline />
		</Box>
	)
}