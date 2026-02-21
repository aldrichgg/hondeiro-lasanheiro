import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { AuthService } from '../services/AuthService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, userProfile: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = AuthService.onAuthChange(async (authUser) => {
            setUser(authUser);

            if (authUser) {
                try {
                    const docSnap = await getDoc(doc(db, 'users', authUser.uid));
                    if (docSnap.exists()) {
                        setUserProfile(docSnap.data() as UserProfile);
                    } else {
                        // Create profile if it doesn't exist (handles legacy users)
                        const newProfile: UserProfile = {
                            uid: authUser.uid,
                            email: authUser.email || '',
                            displayName: authUser.displayName || authUser.email?.split('@')[0] || 'Membro',
                            isAdmin: false,
                            createdAt: new Date()
                        };
                        await setDoc(doc(db, 'users', authUser.uid), newProfile);
                        setUserProfile(newProfile);
                    }
                } catch (err) {
                    console.error('Error fetching/creating user profile:', err);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, userProfile, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
