import { useStdout } from 'ink'

export function useClear() {
    const stdout = useStdout()
    return () => {
        stdout.write(`clear-display`)
    }
}