import { Text, Box, Newline } from 'ink'
import React, { useEffect, useState } from 'react'
import { ProfileType, fetchCurrentUser } from './api.js'


export default function Profile() {
    const [profile, setProfile] = useState<ProfileType>()

    useEffect(() => {
        fetchCurrentUser().then(data => {
            setProfile(data)
        })
    }, [])

    if (!profile) return

	return (
		<Box>
			<Text>{'Hi, ' + profile.email }</Text>
            <Text>  </Text>
			<Text>{'Your forwarding address is: ' + profile.fwdAddress}</Text>
            <Newline />
		</Box>
	)
}