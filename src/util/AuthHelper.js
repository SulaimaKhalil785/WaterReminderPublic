import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebaseConfig";
import {storeData} from "./StorageHelper";
import {authActions} from "../constants/authActions";

const getPremiumStatus = async (user) => {
    const tokenResult = await user.getIdTokenResult();
    const claims = tokenResult?.claims || user?.customClaims || {};

    return Boolean(
        claims?.isPremium ||
        claims?.premium ||
        claims?.subscription === 'premium'
    );
};

const dispatchAuthUser = async (dispatch, action, user) => {
    const userData = {
        uid: user.uid,
        isPremiumUser: await getPremiumStatus(user)
    };

    await storeData('uid', userData.uid);
    await storeData('isPremiumUser', String(userData.isPremiumUser));
    dispatch(action(userData));
};

export const onAuthStateChanged = (dispatch) => {
    auth.onAuthStateChanged((user) => {
        if (user) {
            dispatchAuthUser(dispatch, authActions.onAuthStateChange, user);
        } else {
            storeData('uid', '').then(() => {
                storeData('isPremiumUser', 'false').then(() => {
                    dispatch(authActions.signOut());
                });
            });
        }
    });
}

export const signIn = (dispatch, email, password) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        dispatchAuthUser(dispatch, authActions.signIn, userCredential.user);
    }).catch((err) => {
        dispatch(authActions.throwError(err.message));
    });
}

export const signUp = (dispatch, email, password) => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        dispatchAuthUser(dispatch, authActions.signUp, userCredential.user);
    }).catch((err) => {
        dispatch(authActions.throwError(err.message));
    });
}

