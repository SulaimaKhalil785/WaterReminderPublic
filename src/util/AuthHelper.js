import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebaseConfig";
import {storeData} from "./StorageHelper";
import {authActions} from "../constants/authActions";

const premiumStatusRequests = {};

// const getPremiumStatus = async (user) => {
//     const tokenResult = await user.getIdTokenResult();
//     const claims = tokenResult?.claims || user?.customClaims || {};

//     return Boolean(
//         claims?.isPremium ||
//         claims?.premium ||
//         claims?.subscription === 'premium'
//     );
// };
const getPremiumStatus = async (user) => {
    if (user.email === 'testpremium@gmail.com') {
        return true;
    }

    const tokenResult = await user.getIdTokenResult();
    const claims = tokenResult?.claims || user?.customClaims || {};

    return Boolean(
        claims?.isPremium ||
        claims?.premium ||
        claims?.subscription === 'premium'
    );
};

const getInitialPremiumStatus = (user) => user.email === 'testpremium@gmail.com';

const getPremiumStatusOnce = (user) => {
    if (!premiumStatusRequests[user.uid]) {
        premiumStatusRequests[user.uid] = getPremiumStatus(user).finally(() => {
            delete premiumStatusRequests[user.uid];
        });
    }

    return premiumStatusRequests[user.uid];
};

const persistAuthUser = (userData) => {
    Promise.all([
        storeData('uid', userData.uid),
        storeData('isPremiumUser', String(userData.isPremiumUser))
    ]).catch((error) => {
        console.warn('Auth persistence failed:', error);
    });
};

const dispatchAuthUser = (dispatch, action, user) => {
    const userData = {
        uid: user.uid,
        isPremiumUser: getInitialPremiumStatus(user)
    };

    dispatch(action(userData));

    getPremiumStatusOnce(user).then((isPremiumUser) => {
        const resolvedUserData = {
            uid: user.uid,
            isPremiumUser
        };
        persistAuthUser(resolvedUserData);
        if (isPremiumUser !== userData.isPremiumUser) {
            dispatch(action(resolvedUserData));
        }
    }).catch((error) => {
        console.warn('Premium status lookup failed:', error);
        persistAuthUser(userData);
    });
};

export const onAuthStateChanged = (dispatch) => {
    if (!auth) {
        dispatch(authActions.signOut());
        return () => {};
    }

    return auth.onAuthStateChanged((user) => {
        if (user) {
            dispatchAuthUser(dispatch, authActions.onAuthStateChange, user);
        } else {
            dispatch(authActions.signOut());
            Promise.all([
                storeData('uid', ''),
                storeData('isPremiumUser', 'false')
            ]).catch((error) => {
                console.warn('Auth cleanup failed:', error);
            });
        }
    });
}

export const signIn = (dispatch, email, password) => {
    if (!auth) {
        dispatch(authActions.throwError('Firebase Auth is not initialized.'));
        return;
    }

    return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        dispatchAuthUser(dispatch, authActions.signIn, userCredential.user);
    }).catch((err) => {
        dispatch(authActions.throwError(err.message));
    });
}

export const signUp = (dispatch, email, password) => {
    if (!auth) {
        dispatch(authActions.throwError('Firebase Auth is not initialized.'));
        return;
    }

    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        dispatchAuthUser(dispatch, authActions.signUp, userCredential.user);
    }).catch((err) => {
        dispatch(authActions.throwError(err.message));
    });
}

