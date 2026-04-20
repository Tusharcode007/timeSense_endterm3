import { auth, provider, db } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export const loginWithGoogleService = async () => {
    try {
        // Explicitly request calendar scopes to generate a usable access token
        provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
        
        const result = await signInWithPopup(auth, provider);
        
        // Extract the Google Access Token securely
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken || null;
        const userPayload = result.user;

        // Structurally store the identity strictly inside Firestore
        const userRef = doc(db, 'users', userPayload.uid);
        await setDoc(userRef, {
            uid: userPayload.uid,
            email: userPayload.email,
            displayName: userPayload.displayName,
            photoURL: userPayload.photoURL,
            lastLogin: serverTimestamp()
        }, { merge: true });

        return {
            uid: userPayload.uid,
            email: userPayload.email,
            displayName: userPayload.displayName,
            photoURL: userPayload.photoURL,
            calendarToken: token
        };
    } catch (error) {
        console.error("Google SSO Service Failure:", error);
        throw error;
    }
};

export const signUpWithEmailService = async (email, password, displayName) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const userPayload = result.user;

        const userRef = doc(db, 'users', userPayload.uid);
        await setDoc(userRef, {
            uid: userPayload.uid,
            email: userPayload.email,
            displayName: displayName || userPayload.email.split('@')[0], // Fallback pseudo-name
            photoURL: null,
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp()
        }, { merge: true });

        return {
            uid: userPayload.uid,
            email: userPayload.email,
            displayName: displayName || userPayload.email.split('@')[0],
            photoURL: null,
            calendarToken: null
        };
    } catch (error) {
        console.error("Email Signup Service Failure:", error);
        throw error;
    }
};

export const loginWithEmailService = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const userPayload = result.user;
        
        // Update last login marker securely
        const userRef = doc(db, 'users', userPayload.uid);
        await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });

        return {
            uid: userPayload.uid,
            email: userPayload.email,
            displayName: userPayload.displayName || userPayload.email.split('@')[0],
            photoURL: userPayload.photoURL,
            calendarToken: null // Standard log-in natively cannot mint Google Auth bounds natively.
        };
    } catch (error) {
        console.error("Email Login Service Failure:", error);
        throw error;
    }
};

export const logoutService = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout Service Failure:", error);
        throw error;
    }
};
