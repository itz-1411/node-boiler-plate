import dotenv         from 'dotenv'
import { getPath }    from "#lib/utils"
import process        from 'process'

dotenv.config({ path: getPath('.env') })

import appConfig      from "./app.js"
import authConfig     from "./auth.js"
import dbConfig       from "./database.js"
// import redisConfig from "./redis.js"
import serverConfig   from "./server.js"
import mailConfig     from "./mail.js"
import fmcsaConfig    from "./fmcsa.js"
import stripeConfig   from './stripe.js'

export const server = serverConfig(process.env)
export const app    = appConfig(process.env)
export const db     = dbConfig(process.env)
// export const redis = redisConfig(process.env);
export const auth   = authConfig(process.env)
export const mail   = mailConfig(process.env)
export const fmcsa  = fmcsaConfig(process.env)
export const stripe = stripeConfig(process.env)
// export const rozerpay = rozerpayConfig(process.env);

process.title       = app.appName

export default {
	server, app, db, auth, mail, fmcsa, stripe, // redis, rozerpay,
};