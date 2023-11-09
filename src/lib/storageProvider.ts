import fs from 'node:fs/promises'
import { constants as fsConstants } from 'node:fs'
import os from 'os'
import path from 'path'

const appConfigPath = path.join(os.homedir(), '.config', 'lettr')
const appConfigFile = path.join(os.homedir(), '.config', 'lettr', 'app.json')

;(async function setup() {
	// create config folder
	try {
		await fs.access(appConfigPath, fsConstants.F_OK)
	} catch {
		await fs.mkdir(appConfigPath, { recursive: true })
	}

	// write empty config file
	try {
		await fs.access(appConfigFile, fsConstants.F_OK)
	} catch (e) {
		console.log('writing config file to', appConfigFile)
		await fs.writeFile(appConfigFile, '{}')
	}
})()

async function _readConfigFile() {
	try {
		let data = await fs.readFile(appConfigFile, { encoding: 'utf-8' })
		return JSON.parse(data)
	} catch (e) {
		return null
	}
}

async function _writeConfigFile(data: object) {
	try {
		await fs.writeFile(appConfigFile, JSON.stringify(data))
	} catch (e) {
		console.error('Could not write file', e)
	}
}

async function getItem(key: string) {
	let data = await _readConfigFile()
	try {
		return data[key]
	} catch {
		return null
	}
}

async function setItem(key: string, value: any) {
	let data = await _readConfigFile()
	data[key] = value
	await _writeConfigFile(data)
}

async function removeItem(key: string) {
	let data = await _readConfigFile()
	delete data[key]
	await _writeConfigFile(data)
}

export default {
	getItem,
	setItem,
	removeItem,
}
