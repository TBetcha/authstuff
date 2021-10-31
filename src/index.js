/** @format */

import './env.js'
import { fastify } from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDb } from './db.js'

//ESM change
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = fastify()

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, 'public'),
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
