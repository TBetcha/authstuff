/** @format */
import bcrypt from 'bcryptjs'
const { genSalt, hash } = bcrypt
import { user } from '../user/user.js'

export async function registerUser(email, password) {
  const { user } = await import('../user/user.js')
  //generate salt
  const salt = await genSalt(10)

  //hash with salt
  const hashedPassword = await hash(password, salt)

  //store in dn
  const result = await user.insertOne({
    email: {
      address: email,
      verified: false,
    },
    password: hashedPassword,
  })

  //return user from db
  return result.insertedId
}
