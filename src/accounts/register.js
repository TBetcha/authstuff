/** @format */

import { genSalt, hast } from 'bcryptjs'

export async function registerUser(email, password) {
  //generate salt
  const salt = await genSalt(10)

  //hash with salt
  const hashedPassword = await hash(password, salt)
  console.log('hashedPassword', hashedPassword)

  //store in dn

  //return user from db
}
