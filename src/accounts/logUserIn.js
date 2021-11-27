/** @format */

import { createSession } from './session.js'

export async function logUserIn(userId, request, reply) {
  //create session
  const connectionInformation = {
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  }

  const sessionToken = await createSession(userId, connectionInformation)
  console.log('session token', sessionToken)
  //creaate jwt
  //set cookies
}
