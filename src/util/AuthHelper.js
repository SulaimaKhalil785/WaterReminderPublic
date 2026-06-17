import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { storeData } from "./StorageHelper";
import { authActions } from "../constants/authActions";

const getPremiumStatus = async (user) => {
    // Dummy Premium Credentials for testing
    if (user.email === 'premium@test.com' || user.email === 'testpremium@gmail.com' || user.uid === 'dummy-premium-uid') {
        return true;
    }

    try {
        const tokenResult = await user.getIdTokenResult();
        const claims = tokenResult?.claims || {};
        return Boolean(claims?.isPremium || claims?.premium);
    } catch (e) {
        return false;
    }
};

const dispatchAuthUser = async (dispatch, action, user) => {
    const isPremium = await getPremiumStatus(user);
    const userData = {
        uid: user.uid,
        email: user.email,
        isPremiumUser: isPremium
    };

    await storeData('uid', userData.uid);
    await storeData('isPremiumUser', String(isPremium));
    dispatch(action(userData));
};

export const onAuthStateChanged = (dispatch) => {
    if (!auth) {
        dispatch(authActions.signOut());
        return () => { };
    }

    return auth.onAuthStateChanged((user) => {
        if (user) {
            dispatchAuthUser(dispatch, authActions.onAuthStateChange, user);
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
    // Mock login for dummy premium account
    if (email === 'premium@test.com' && password === 'premium123') {
        const dummyUser = {
            uid: 'dummy-premium-uid',
            email: 'premium@test.com'
        };
        dispatchAuthUser(dispatch, authActions.signIn, dummyUser);
        return;
    }

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
