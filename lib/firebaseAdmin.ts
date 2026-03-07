import * as admin from 'firebase-admin'

function getAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      } as admin.ServiceAccount)
    })
  }
  return admin
}

export async function sendPushNotification(tokens: string[], title: string, body: string, data: any = {}) {
  if (!tokens.length) return { successCount: 0, failureCount: 0 }
  try {
    const messaging = getAdmin().messaging()
    const response = await messaging.sendEachForMulticast({ notification: { title, body }, data, tokens })
    return response
  } catch (error) {
    console.error('Push error:', error)
    throw error
  }
}
