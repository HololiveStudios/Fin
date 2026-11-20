import { initializeApp } from 'firebase/app';
import { getAuth }       from 'firebase/auth';
import { getFirestore }  from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyDULf3XSwiiFQZ7q_M9YNieDbWZNLnO7Nw",
  authDomain:        "myapp-415315.firebaseapp.com",
  databaseURL:       "https://myapp-415315-default-rtdb.firebaseio.com",
  projectId:         "myapp-415315",
  storageBucket:     "myapp-415315.appspot.com",
  messagingSenderId: "103002319588",
  appId:             "1:103002319588:web:3ea72fa9dcf2b84a4e1af1",
  measurementId:     "G-925P7JVHNV",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
