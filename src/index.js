/** @format */

import './env.js'
import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './db.js'
import { registerUser } from './accounts/register.js'
import { authorizeUser } from './accounts/authorize.js'

//ESM change
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
    })

    app.post('/api/register', {}, (request, reply) => {
      try {
        registerUser(request.body.email, request.body.password)
      } catch (e) {
        console.error(e)
      }
      console.log('request', request.body.password, request.body.email)
    })

    app.post('/api/authorize', {}, async (request, reply) => {
      try {
        console.log(request.body.email, request.body.password)
        const userId = await authorizeUser(request.body.email, request.body.password)
      } catch (e) {
        console.error(e)
      }
    })

    await app.listen(3000)
    console.log('λ 🚀 ')
    console.log(process.env.MONGO_DB)
  } catch (e) {
    console.error(e)
  }
}

connectDb().then(() => {
  startApp()
})
