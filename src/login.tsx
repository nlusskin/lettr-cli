import React, { useState } from 'react'
import { Text, Box, useInput } from 'ink'


export default function Login() {
    enum lineModes {
        UNAME = 0,
        METHOD = 1,
        PWD = 2,
        FINAL = 3
    }
    enum methods {
        PWD = 0,
        PIN = 1
    }

    const [method, setMethod] = useState(methods.PWD)
    const [lineMode, setLineMode] = useState(lineModes.UNAME)
    const [usernameInputValue, setUsernameInputValue] = useState('')
    const [passwordInputValue, setPasswordInputValue] = useState('')

    useInput((input, key) => {
        if (key.return) {
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

        if (lineMode == lineModes.METHOD) {
            if (key.leftArrow) { setMethod(method - (method == 1 ? 1 : -1)) }
            if (key.rightArrow) { setMethod(method + (method == 0 ? 1 : -1)) }
        }

        if (lineMode == lineModes.PWD) {
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
                Use your Mailbrew credentials to log in.
            </Text>

            <Text>
                Username: <Text color='green'>{usernameInputValue}</Text>
            </Text>

            {lineMode > lineModes.UNAME &&
                <Box>
                    <Text>Sign in method: </Text>
                    <Text
                        color={method == methods.PWD ? 'green' : ''}
                        underline={method == methods.PWD}
                    >
                        Password
                    </Text>
                    <Text> / </Text>
                    <Text
                        color={method == methods.PIN ? 'green' : ''}
                        underline={method == methods.PIN}
                    >
                        Email Pin
                    </Text>
                </Box>
            }

            {lineMode > lineModes.METHOD &&
                <Text>
                    {method == methods.PWD && <Text>Password: </Text>}
                    {method == methods.PIN && <Text>Pin from email: </Text>}
                     <Text color='green'>{passwordInputValue.replaceAll(/./g, '*')}</Text>
                </Text>
            }
            
            {lineMode > lineModes.PWD &&
                <Text>
                    Logging in...
                </Text>
            }
        </Box>
	)
}
