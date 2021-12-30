/** @format */

import { createSession } from './session.js'
import { createTokens } from './tokens.js'
import { refreshTokens } from './user.js'

export async function logUserIn(userId, request, reply) {
  //create session
  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  }

  const sessionToken = await createSession(userId, connectionInformation)

  //create jwt
  //set cookie
  await refreshTokens(sessionToken, userId, reply)
}
