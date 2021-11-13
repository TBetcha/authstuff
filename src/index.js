/** @format */

import './env.js'
import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './db.js'
import { registerUser } from './accounts/register.js'

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
