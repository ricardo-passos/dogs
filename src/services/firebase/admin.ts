import {
  initializeApp,
  applicationDefault,
  getApps,
  cert,
} from 'firebase-admin/app'

// types
import type { App, Credential } from 'firebase-admin/app'

let adminApp: App

const credential: Credential =
  process.env.NODE_ENV === 'production'
    ? cert({
        clientEmail: process.env.SERVICE_ACCOUNT_CLIENT_EMAIL,
        privateKey: process.env.SERVICE_ACCOUNT_PRIVATE_KEY,
        projectId: process.env.SERVICE_ACCOUNT_PROJECT_ID,
      })
    : applicationDefault()

// need to be sure that only one instance is active, otherwise
// `ReferenceError: Cannot access 'adminApp' before initialization` is thrown
if (getApps().length === 0) {
  if (process.env.NODE_ENV === 'development') {
    adminApp = initializeApp({
      projectId: 'dogs-ffe57',
      databaseURL: 'http://localhost:9000/?ns=dogs-ffe57-default-rtdb',
      databaseAuthVariableOverride: {
        uid: 'nodejs-backend',
      },
    })
  } else {
    adminApp = initializeApp({
      credential,
      databaseURL: 'https://dogs-ffe57-default-rtdb.firebaseio.com',
      databaseAuthVariableOverride: {
        uid: 'nodejs-backend',
      },
    })
  }
}

export { adminApp }
