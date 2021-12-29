/** @format */

import mongo from 'mongodb'
import jwt from 'jsonwebtoken'

const JWTSignature = process.env.JWT_SIGNATURE
export async function logUserOut(request, reply) {
  try {
    const { session } = await import('../session/session.js')
    if (request?.cookies?.refreshToken) {
      //get the access and refresh tokens
      const { refreshToken } = request.cookies
      // decode access token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature)
      // delete database record for session
      await session.deleteOne({ sessionToken })
    }
    // remove cookies
    reply.clearCookie('refreshToken').clearCookie('accessToken')
  } catch (e) {
    console.error(e)
  }
}
