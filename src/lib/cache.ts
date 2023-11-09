import { constants as fsConstants } from 'node:fs'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

export const tmpPath = path.join(os.tmpdir(), 'lettr')

;(async function setup() {
    // create tmp directory
    try {
        await fs.access(tmpPath, fsConstants.F_OK)
    } catch (e) {
        await fs.mkdir(tmpPath)
    }
})()


export async function cacheFile(idPath: string, data: any) {
	const pathParts = idPath.split('/')
    const tmpDirPath = path.join(tmpPath, ...pathParts.slice(0, pathParts.length - 1))
    const tmpFilePath = path.join(tmpPath, ...pathParts)
	try {
        await fs.mkdir(tmpDirPath, { recursive: true })
        await fs.writeFile(tmpFilePath, data)
        return true
	} catch (e) {
        console.error(e)
		return null
	}
}

export async function getCachedFile(idPath: string) {
    const tmpFilePath = path.join(tmpPath, idPath)
	try {
        let data = await fs.readFile(tmpFilePath, { encoding: 'utf-8' })
        return data.toString()
	} catch (e) {
        console.error(e)
		return null
	}
}

export async function checkCache(idPath: string) {
    const tmpFilePath = path.join(tmpPath, idPath)
	try {
        await fs.access(tmpFilePath, fsConstants.F_OK)
        return true
	} catch {
		return false
	}
}