import {setGetViewer, setCorsOptions} from '@orion-js/app'
import loginWithPassword from './loginWithPassword'
import logout from './logout'
import changePassword from './changePassword'
import getUserByID from './getUserByID'
import getUserByEmail from './getUserByEmail'
import createUser from './createUser'
import Sessions from '../Sessions'
import getSession from './getSession'
import forgotPassword from './forgotPassword'
import resetPassword from './resetPassword'
import verifyEmail from './verifyEmail'

export default function(options) {
  options.Sessions = Sessions(options)
  options.Session = options.Sessions.model

  const getViewer = getSession(options)
  setGetViewer(getViewer)

  setCorsOptions({
    allowHeaders: [
      'X-Requested-With',
      'Access-Control-Allow-Origin',
      'X-HTTP-Method-Override',
      'Content-Type',
      'Authorization',
      'Accept',
      'x-orion-nonce',
      'x-orion-publickey',
      'x-orion-signature',
      'x-orion-locale'
    ]
  })

  return {
    loginWithPassword: loginWithPassword(options),
    logout: logout(options),
    getUserByID: getUserByID(options),
    getUserByEmail: getUserByEmail(options),
    createUser: createUser(options),
    changePassword: changePassword(options),
    forgotPassword: forgotPassword(options),
    resetPassword: resetPassword(options),
    verifyEmail: verifyEmail(options)
  }
}
