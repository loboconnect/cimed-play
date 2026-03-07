import admin from 'firebase-admin'

if (!admin.apps.length) {

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\\\n/g, '\\n')
    })
  })

}

export async function sendPushNotification(tokens: string[], title: string, body: string, data: any = {}) {

  if (!tokens.length) return

  const message = {
    notification: { title, body },
    data,
    tokens
  }

  try {

    const response = await admin.messaging().sendEachForMulticast(message)

    console.log("Push sent:", response.successCount)

    return response

  } catch (error) {

    console.error("Push error:", error)

    throw error

  }

}
