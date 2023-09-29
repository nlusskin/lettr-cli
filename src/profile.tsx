import { Text, Box, Newline } from 'ink'
import React, { useEffect, useState, useContext } from 'react'
import { ProfileType, fetchCurrentUser } from './api.js'
import { AppContext } from './appContext.js'


export default function Profile() {
    const { appContext } = useContext(AppContext)
    const [profile, setProfile] = useState<ProfileType>()

    useEffect(() => {
        fetchCurrentUser().then(data => {
            setProfile(data)
        })
    }, [])

    if (!profile || appContext.loading) return

	return (
		<Box>
			<Text>{'Hi, ' + profile.email }</Text>
            <Text>  </Text>
			<Text>{'Your forwarding address is: ' + profile.fwdAddress}</Text>
            <Newline />
		</Box>
	)
}