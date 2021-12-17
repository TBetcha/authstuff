/** @format */
import jwt from 'jsonwebtoken'
import mongo from 'mongodb'

const { ObjectId } = mongo

const JWTSignature = process.env.JWT_SIGNATURE
export async function getUserFromCookies(request) {
  try {
    const { user } = await import('../user/user.js')
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
    //get the access and refresh tokens
    // decode access token
    //decode refresh token
    //look up session
    //confirm session is valid
    //if session is valid
    //look up current user
    //refresh tokens
    //return current user
  } catch (e) {
    console.error(e)
  }
}
export async function refreshTokens() {
  try {
  } catch (e) {
    console.error(e)
  }
}
