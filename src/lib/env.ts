import path from 'path'
import dotenv from  'dotenv'

// this is set up to work for production .env file located in ./dist
// for devlepment, load environment variables another way (e.g. direnv)
dotenv.config({
    path: path.join(path.dirname(import.meta.url.replace('file://', '')), '.env'),
    override: true
})