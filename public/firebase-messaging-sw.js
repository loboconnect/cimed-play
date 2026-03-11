importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js")

firebase.initializeApp({
  apiKey: "AIzaSyChQUU9dLn0u4YweuROLBv4nGOU7-TzFb8",
  authDomain: "campanha-digital-2026.firebaseapp.com",
  projectId: "campanha-digital-2026",
  messagingSenderId: "20662461529",
  appId: "1:20662461529:web:e43019645c3a9fcb753d48"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icons/icon-192.png",
    data: payload.data
  }
  self.registration.showNotification(notificationTitle, notificationOptions)
})
