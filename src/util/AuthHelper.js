import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";
import { storeData } from "./StorageHelper";
import { authActions } from "../constants/authActions";

/**
 * Fetch extended user profile from Firestore (isPremium, etc.)
 */
const fetchUserProfile = async (user) => {
    if (!user) return null;
    try {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            // Standardize premium property name for the app
            return {
                ...user,
                ...userData,
                uid: user.uid,
                isPremiumUser: Boolean(userData.isPremium || userData.ispremium)
            };
        }
        return { ...user, isPremiumUser: false };
    } catch (e) {
        console.warn("Error fetching user profile:", e);
        return { ...user, isPremiumUser: false };
    }
};

export const onAuthStateChanged = (dispatch) => {
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const fullUser = await fetchUserProfile(user);
            dispatch(authActions.onAuthStateChange(fullUser));
        } else {
            dispatch(authActions.signOut());
        }
    });
}

export const signIn = (dispatch, email = '', password = '') => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
        dispatch(authActions.throwError("Please enter both email and password."));
        return;
    }

    signInWithEmailAndPassword(auth, cleanEmail, cleanPassword).then(async (userCredential) => {
        const fullUser = await fetchUserProfile(userCredential.user);
        storeData('uid', fullUser.uid).then(() => {
            dispatch(authActions.signIn(fullUser));
        });
    }).catch((err) => {
        let message = err.message;
        if (err.code === 'auth/invalid-email') message = "Invalid email format.";
        if (err.code === 'auth/user-not-found') message = "User not found.";
        if (err.code === 'auth/wrong-password') message = "Incorrect password.";
        dispatch(authActions.throwError(message));
    });
}

export const signUp = (dispatch, email = '', password = '') => {
    const cleanEmail = email.trim();

    createUserWithEmailAndPassword(auth, cleanEmail, password).then(async (userCredential) => {
        const user = userCredential.user;

        // Create initial profile in 'users' collection
        const initialProfile = {
            email: cleanEmail,
            isPremium: false,
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(firestore, "users", user.uid), initialProfile);

        const fullUser = { ...user, ...initialProfile, isPremiumUser: false };
        storeData('uid', user.uid).then(() => {
            dispatch(authActions.signUp(fullUser));
        });
    }).catch((err) => {
        dispatch(authActions.throwError(err.message));
    });
}

export const signOut = (dispatch) => {
    auth.signOut().then(() => {
        dispatch(authActions.signOut());
    }).catch(() => {
        dispatch(authActions.signOut());
    });
}
