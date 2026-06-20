import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { storeData } from "./StorageHelper";
import { authActions } from "../constants/authActions";

export const onAuthStateChanged = (dispatch) => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Check for dummy premium user
            if (user.email === 'premium@test.com') {
                user.isPremiumUser = true;
            }
            dispatch(authActions.onAuthStateChange(user));
        } else {
            dispatch(authActions.signOut());
        }
    });
}

export const signIn = (dispatch, email = '', password = '') => {
    // Clean the input to prevent "invalid-email" errors from trailing spaces
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
        dispatch(authActions.throwError("Please enter both email and password."));
        return;
    }

    // 1. Bypass Firebase for Dummy Premium Credentials
    if (cleanEmail === 'premium@test.com' && cleanPassword === 'premium123') {
        const dummyUser = {
            uid: 'dummy-premium-uid-123',
            email: 'premium@test.com',
            isPremiumUser: true
        };
        storeData('uid', dummyUser.uid).then(() => {
            dispatch(authActions.signIn(dummyUser));
        });
        return;
    }

    // 2. Regular Firebase Login
    signInWithEmailAndPassword(auth, cleanEmail, cleanPassword).then((userCredential) => {
        const user = userCredential.user;
        if (user.email === 'premium@test.com') {
            user.isPremiumUser = true;
        }
        storeData('uid', user.uid).then(() => {
            dispatch(authActions.signIn(user));
        });
    }).catch((err) => {
        // Map common errors to friendly messages
        let message = err.message;
        if (err.code === 'auth/invalid-email') message = "The email address is badly formatted.";
        if (err.code === 'auth/user-not-found') message = "No user found with this email.";
        if (err.code === 'auth/wrong-password') message = "Incorrect password.";

        dispatch(authActions.throwError(message));
    });
}

export const signUp = (dispatch, email = '', password = '') => {
    const cleanEmail = email.trim();

    createUserWithEmailAndPassword(auth, cleanEmail, password).then((userCredential) => {
        const user = userCredential.user;
        if (user.email === 'premium@test.com') {
            user.isPremiumUser = true;
        }
        storeData('uid', user.uid).then(() => {
            dispatch(authActions.signUp(user));
        });
    }).catch((err) => {
        dispatch(authActions.throwError(err.message));
    });
}
