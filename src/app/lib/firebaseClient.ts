// src/lib/firebaseClient.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    // RecaptchaVerifier, // Not needed for current UI, but keep if you reintroduce phone auth
    // signInWithPhoneNumber // Not needed for current UI, but keep if you reintroduce phone auth
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAbdYieP2keuxGC-kmXfZHZCYyZrHTmSVE",
    authDomain: "cleanmatch-e0851.firebaseapp.com",
    projectId: "cleanmatch-e0851",
    storageBucket: "cleanmatch-e0851.firebasestorage.app",
    messagingSenderId: "326051690742",
    appId: "1:326051690742:web:91f18d84d5198284b914d7",
    measurementId: "G-2ZMZJY80PJ"
};

export const getFirebaseApp = () => {
    if (!getApps().length) {
        return initializeApp(firebaseConfig);
    }
    return getApp();
};

export const auth = (() => {
    const app = getFirebaseApp();
    return getAuth(app);
})();

export const googleProvider = new GoogleAuthProvider();

// // If you reintroduce phone auth, uncomment this:
// export const createRecaptcha = (containerId = "recaptcha-container") => {
//   try {
//     // @ts-ignore
//     return new RecaptchaVerifier(containerId, { size: "invisible" }, auth);
//   } catch (err) {
//     console.warn("Recaptcha can't be created server-side or without 'window'.");
//     return null;
//   }
// };