  // Import the functions you need from the SDKs you need
  import { initializeApp } from "firebase/app";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  //import * as firebaseAuth from 'firebase/auth';
  import { initializeAuth , getReactNativePersistence  } from "firebase/auth";
  import AsyncStorage from "@react-native-async-storage/async-storage"
  import { getFirestore } from "firebase/firestore";
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBowYhdzbwCn6ykDkWwbQcpqLzW24clkcA",
    authDomain: "xpenselog.firebaseapp.com",
    projectId: "xpenselog",
    storageBucket: "xpenselog.firebasestorage.app",
    messagingSenderId: "580018587497",
    appId: "1:580018587497:web:d30033ce5424124b1b5ff8"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  //Auth
  export const auth = initializeAuth(app, {
      persistence: getReactNativePersistence (AsyncStorage)
  });
  //the persistance error is solved in the tsconfig

  //In computer words, a DocumentReference is like a magical helper 🧙♂️ that points to one exact spot (like your teddy bear’s box) in a giant toy room (your app’s data). 
  // When you give it a "path" (like "third shelf / red box / teddy bear"), 
  // it remembers that exact spot so you can find, read, or change it later. //doc 
  //db
  export const firestore = getFirestore(app);
