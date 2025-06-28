import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// Your Firebase configuration
// Replace these values with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCSxRQ8hNnoJPu7cZd1gghrsYded6Dm3s4",
  authDomain: "help-hive-ff13c.firebaseapp.com",
  projectId: "help-hive-ff13c",
  storageBucket: "help-hive-ff13c.firebasestorage.app",
  messagingSenderId: "5405411817",
  appId: "1:5405411817:web:9237e192a13abc89e76378",
  measurementId: "G-4605N202P6"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

export default app 