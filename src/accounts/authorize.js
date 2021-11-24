/** @format */
import bcrypt from 'bcryptjs'

const { compare } = bcrypt

export async function authorizeUser(email, password) {
  const { user } = await import('../user/user.js')
  //look up user

  const userData = await user.findOne({
    'email.address': email,
  })
  console.log(userData)
  //get user password
  const savedPassword = userData.password

  //compare password
  const isAuthorized = await compare(password, savedPassword)
  console.log('isAuthorized', isAuthorized)

  //return boolean of if password is correct
  // return isAuthorized
}
