import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7sytGqYqh87IvH5jVtKT8Tx3vesZABeI",
  authDomain: "shopping-app-f050c.firebaseapp.com",
  projectId: "shopping-app-f050c",
  storageBucket: "shopping-app-f050c.firebasestorage.app",
  messagingSenderId: "134255890423",
  appId: "1:134255890423:web:c40b1fb544e87d31fbe8f2",
  measurementId: "G-80DE3PMPZJ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

