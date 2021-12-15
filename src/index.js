/** @format */

import './env.js'
import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './db.js'
import { registerUser } from './accounts/register.js'
import { authorizeUser } from './accounts/authorize.js'
import fastifyCookie from 'fastify-cookie'
import { logUserIn } from './accounts/logUserIn.js'

//ESM change
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    })

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
        const { isAuthorized, userId } = await authorizeUser(
          request.body.email,
          request.body.password
        )
        if (isAuthorized) {
          await logUserIn(userId, request, reply)
          reply.send({
            data: 'User Logged In',
          })
        }
        reply.send({
          data: 'Auth Failed',
        })
      } catch (e) {
        console.error(e)
      }
    })

    app.get('/test', {}, (request, reply) => {
      console.log(request.cookies.testCookie)
      console.log(request.headers['user-agent'])
      reply.send({
        data: 'hello world from da cookie',
      })
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
