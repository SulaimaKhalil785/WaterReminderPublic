import {addDoc, collection, doc, onSnapshot, orderBy, query, setDoc} from "firebase/firestore";
import {firestore} from "../../firebaseConfig";
import {firebaseActions} from "../context/FirebaseContext";
import moment from "moment";

const logFirestoreError = (operation, error) => {
    console.warn(`Firestore ${operation} failed:`, error?.code || error?.message || error);
};

const noopUnsubscribe = () => {};

const canUseFirestore = (operation, userId) => {
    if (!firestore || !userId) {
        logFirestoreError(operation, !firestore ? 'Firestore is not initialized' : 'Missing user id');
        return false;
    }

    return true;
};

export const fetchWaterRecords = (dispatch, userId) => {
    if (!canUseFirestore('fetchWaterRecords listener', userId)) {
        return noopUnsubscribe;
    }

    const today = moment().format("YYYY-MM-DD");
    const waterRecordQuery = query(collection(firestore, `${userId}/History/${today}`), orderBy('timeStamp', 'desc'));
    return onSnapshot(waterRecordQuery, (docRef) => {
        const docRefTemp = [];
        docRef.forEach((doc) => {
            docRefTemp.push({id: doc.id, data: doc.data()})
        });
        dispatch(firebaseActions.fetchWaterRecords(docRefTemp));
    }, (error) => logFirestoreError('fetchWaterRecords listener', error));
}

export const saveWaterRecord = (dispatch, userId, size) => {
    if (!canUseFirestore('saveWaterRecord write', userId)) {
        return Promise.resolve();
    }

    const today = moment().format("YYYY-MM-DD");
    const now = moment().format("HH:mm")
    return addDoc(collection(firestore, `${userId}/History/${today}`), {
        time: now,
        timeStamp: moment().format(),
        size: size
    }).then(() => {
        dispatch(firebaseActions.saveWaterRecords());
    }).catch((error) => logFirestoreError('saveWaterRecord write', error));
}

export const fetchWaterRecord = (dispatch, userId, date) => {
    if (!canUseFirestore('fetchWaterRecord listener', userId) || !date) {
        return noopUnsubscribe;
    }

    const waterRecordQuery = query(collection(firestore, `${userId}/History/${date}`), orderBy('timeStamp', 'desc'));
    return onSnapshot(waterRecordQuery, (docRef) => {
        const docRefTemp = [];
        docRef.forEach((doc) => {
            docRefTemp.push({id: doc.id, data: doc.data()})
        });
        dispatch(firebaseActions.fetchWaterRecord(docRefTemp));
    }, (error) => logFirestoreError('fetchWaterRecord listener', error));
}


export const fetchWaterGoal = (dispatch, userId) => {
    if (!canUseFirestore('fetchWaterGoal listener', userId)) {
        return noopUnsubscribe;
    }

    const waterDocRef = doc(firestore, `${userId}/History`);
    return onSnapshot(waterDocRef, (docRef) => {
        if (docRef.data() === undefined) {
            const defaultGoal = { waterGoal: 2500 };
            setDoc(doc(firestore, `${userId}/History`), {
                waterGoal: defaultGoal.waterGoal
            }).then(() => {
                dispatch(firebaseActions.saveWaterGoal(defaultGoal));
            }).catch((error) => logFirestoreError('create default waterGoal', error));
        } else {
            dispatch(firebaseActions.fetchWaterGoal(docRef.data()));
        }
    }, (error) => logFirestoreError('fetchWaterGoal listener', error));
}

export const saveWaterGoal = (dispatch, userId, waterGoal) => {
    if (!canUseFirestore('saveWaterGoal write', userId)) {
        return Promise.resolve();
    }

    const waterGoalValue = Number(waterGoal);
    return setDoc(doc(firestore, `${userId}/History`), {
        waterGoal: waterGoalValue
    }).then(() => {
        dispatch(firebaseActions.saveWaterGoal({ waterGoal: waterGoalValue }));
    }).catch((error) => logFirestoreError('saveWaterGoal write', error));
}
