import { initializeApp } from 'firebase/app';

import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA9KkAlYSkMCasy8tL2luNH1f954bIzb9w',
  authDomain: 'rn-project-93a03.firebaseapp.com',
  projectId: 'rn-project-93a03',
  storageBucket: 'rn-project-93a03.appspot.com',
  messagingSenderId: '897010616231',
  appId: '1:897010616231:web:f68247c9728a48425f5882',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
