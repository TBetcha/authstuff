/** @format */

import { randomBytes } from 'crypto'

export async function createSession(userId, connection) {
  try {
    // generate a session token
    const sessionToken = randomBytes(43).toString('hex')
    //retrieve connection information i.e. user agent, ip address, etc.
    const { ip, userAgent } = connection
    //database insert for session
    const { session } = await import('../session/session.js')
    await session.insertOne({
      sessionToken,
      userId,
      valid: true,
      userAgent,
      ip,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    return sessionToken
  } catch (e) {
    throw new Error('Throw that errror, boy!')
  }
  //return session token
}
