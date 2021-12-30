/** @format */
import jwt from 'jsonwebtoken'
import mongo from 'mongodb'
import { createTokens } from './tokens.js'

const { ObjectId } = mongo

const JWTSignature = process.env.JWT_SIGNATURE
export async function getUserFromCookies(request, reply) {
  try {
    const { user } = await import('../user/user.js')
    const { session } = await import('../session/session.js')
    //check access token exists
    if (request?.cookies?.accessToken) {
      // check if access token
      const { accessToken } = request.cookies
      //decode jwt
      const decodedAccessToken = jwt.verify(accessToken, JWTSignature)
      console.log('decoded access token: ', decodedAccessToken)
      //return user from record
      return user.findOne({
        _id: ObjectId(decodedAccessToken?.userId),
      })
    }
    if (request?.cookies?.refreshToken) {
      //get the access and refresh tokens
      const { refreshToken } = request.cookies
      // decode access token
      const { sessionToken } = jwt.verify(refreshToken, JWTSignature)
      // console.log('decoded refresh token', decodedRefreshToken)
      //look up session
      const currentSession = await session.findOne({ sessionToken })
      console.log('currentSession', currentSession)
      //confirm session is valid
      if (currentSession.valid) {
        //look up current user
        const currentUser = await user.findOne({ _id: ObjectId(currentSession.userId) })
        console.log('currentuser', currentUser)
        //refresh tokens
        await refreshTokens(sessionToken, currentUser._id, reply)
        //return current user
        return currentUser
      }
    }
    //decode refresh token
    //if session is valid
  } catch (e) {
    console.error(e)
  }
}
export async function refreshTokens(sessionToken, userId, reply) {
  try {
    const { accessToken, refreshToken } = await createTokens(sessionToken, userId)

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
  } catch (e) {
    console.error(e)
  }
}
