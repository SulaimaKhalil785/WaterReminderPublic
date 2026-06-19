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

export const signIn = (dispatch, email, password) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        const user = userCredential.user;
        if (user.email === 'premium@test.com') {
            user.isPremiumUser = true;
        }
        storeData('uid', user.uid).then(() => {
            dispatch(authActions.signIn(user));
        });
    }).catch((err) => {
        dispatch(authActions.throwError(err.message));
    });
}

export const signUp = (dispatch, email, password) => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
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

