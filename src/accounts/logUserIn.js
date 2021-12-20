/** @format */

import { createSession } from './session.js'
import { createTokens } from './tokens.js'

export async function logUserIn(userId, request, reply) {
  //create session
  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  }

  const sessionToken = await createSession(userId, connectionInformation)
  console.log('session token', sessionToken)
  //creaate jwt
  const { accessToken, refreshToken } = await createTokens(sessionToken, userId)
  //set cookies
  const now = new Date()
  //get date 30 days from now
  const refreshExpires = now.setDate(now.getDate() + 30)
  reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
      expires: refreshExpires,
    })
    .setCookie('accessToken', accessToken, {
      path: '/',
      domain: 'localhost',
      httpOnly: true,
    })
}
