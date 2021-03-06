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
import { getUserFromCookies } from './accounts/user.js'
import { logUserIn } from './accounts/logUserIn.js'
import { logUserOut } from './accounts/logUserOut.js'

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

    app.post('/api/register', {}, async (request, reply) => {
      try {
        const userId = await registerUser(request.body.email, request.body.password)
        if (userId) {
          await logUserIn(userId, request, reply)
          reply.send({
            data: {
              status: 'SUCCESS',
              userId,
            },
          })
        }
      } catch (e) {
        console.error(e)
        reply.send({
          data: {
            status: 'FAILED',
            userId,
          },
        })
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
            data: {
              status: 'SUCCESS',
              userId,
            },
          })
        }
      } catch (e) {
        console.error(e)
        reply.send({
          data: {
            status: 'FAILED',
            userId,
          },
        })
      }
    })

    app.post('/api/logout', {}, async (request, reply) => {
      try {
        await logUserOut(request, reply)
        reply.send({
          data: 'User Logged Out',
        })
      } catch (e) {
        console.error(e)
      }
    })

    app.get('/test', {}, async (request, reply) => {
      try {
        //verify user login

        const user = await getUserFromCookies(request, reply)
        //return user email if it exists, otherwise return unauthorized
        console.log(request.cookies.testCookie)
        console.log(request.headers['user-agent'])
        if (user?._id) {
          reply.send({
            data: user,
          })
        } else {
          reply.send({
            data: 'user lookup failed',
          })
        }
      } catch (e) {
        throw new Error(e)
      }
    })

    await app.listen(3000)
    console.log('?? ???? ')
    console.log(process.env.MONGO_DB)
  } catch (e) {
    console.error(e)
  }
}

connectDb().then(() => {
  startApp()
})
