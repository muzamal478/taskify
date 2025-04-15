import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  // Your Firebase config object
  apiKey: "YOUR_API_KEY",
  authDomain: "taskmanager-b714f.firebaseapp.com",
  projectId: "taskmanager-b714f",
  storageBucket: "taskmanager-b714f.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };







