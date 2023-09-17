import React, { useState } from 'react'
import { Text, Box, useInput } from 'ink'
import { createLogin, verify } from './api.js'


export default function Login() {
    enum lineModes {
        UNAME = 0,
        PIN = 1,
        FINAL = 2
    }

    const [lineMode, setLineMode] = useState(lineModes.UNAME)
    const [usernameInputValue, setUsernameInputValue] = useState('')
    const [passwordInputValue, setPasswordInputValue] = useState('')
    const [error, setError] = useState('')

    useInput(async (input, key) => {
        if (key.return) {
            if (lineMode == lineModes.UNAME) {
                let { error } = await createLogin(usernameInputValue)
                if (error) {
                    setError(error.message)
                    return
                }
            }
            if (lineMode == lineModes.PIN) {
                let { error } = await verify(usernameInputValue, passwordInputValue)
                if (error) {
                    setError(error.message)
                    return
                }
            }
            
            if (lineMode != lineModes.FINAL) {
                setLineMode(lineMode + 1)
                return
            }
        }

        if (lineMode == lineModes.UNAME) {
            if (key.backspace || key.delete) {
                setUsernameInputValue(usernameInputValue.slice(0, -1))
                return
            }
            setUsernameInputValue(usernameInputValue + input)
        }

        if (lineMode == lineModes.PIN) {
            if (key.backspace || key.delete) {
                setPasswordInputValue(passwordInputValue.slice(0, -1))
                return
            }
            setPasswordInputValue(passwordInputValue + input)
        }

    })

	return (
        <Box flexDirection='column'>
            <Text>
                Enter your email to log in or create an account
            </Text>

            <Text>
                Email: <Text color='green'>{usernameInputValue}</Text>
            </Text>

            {lineMode > lineModes.UNAME &&
                <Text>
                    <Text>Pin from email: </Text>
                     <Text color='green'>{passwordInputValue.replaceAll(/./g, '*')}</Text>
                </Text>
            }
            
            {lineMode > lineModes.PIN &&
                <Text>
                    Logging in...
                </Text>
            }
            {error && <Text>{error}</Text>}
        </Box>
	)
}
