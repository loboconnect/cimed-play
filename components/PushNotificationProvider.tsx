'use client'

import { useEffect, useState } from 'react'
import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [isPermissionGranted, setIsPermissionGranted] = useState(false)
  const [fcmToken, setFcmToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const requestPermission = async () => {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return
      setIsPermissionGranted(true)
      const messaging = getMessaging(app)
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      })
      if (token) {
        setFcmToken(token)
        await fetch('/api/notifications/register-device', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fcm_token: token, device_type: 'web' })
        })
      }
    } catch (err) {
      setError('Erro ao configurar notificações')
      console.error(err)
    }
  }

  useEffect(() => {
    setIsSupported('Notification' in window)
    setIsPermissionGranted(Notification.permission === 'granted')
  }, [])

  return { isSupported, isPermissionGranted, fcmToken, requestPermission, error }
}

export default function PushNotificationProvider() {
  return null
}
