import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export const AuthService = {
    register: async (email: string, pass: string, displayName: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
        const user = userCredential.user;

        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            isAdmin: false,
            createdAt: new Date()
        });

        return user;
    },

    login: async (email: string, pass: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, pass);
        return userCredential.user;
    },

    logout: async () => {
        await signOut(auth);
    },

    onAuthChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    }
};
