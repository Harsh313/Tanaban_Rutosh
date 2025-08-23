// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBx0VbjBbOPFMsN4JDkOcV-oIHlUDrRCNE",
  authDomain: "your_project_id.firebaseapp.com",
  projectId: "login-d364f",
  storageBucket: "your_project_id.appspot.com",
  messagingSenderId: "your_id",
  appId: "your_app_id"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
