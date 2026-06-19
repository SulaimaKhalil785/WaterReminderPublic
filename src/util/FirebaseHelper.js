import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { firebaseActions } from "../context/FirebaseContext";
import moment from "moment";

export const fetchWaterRecords = (dispatch, userId, date = moment().format("YYYY-MM-DD")) => {
    const waterRecordQuery = query(collection(firestore, `${userId}/History/${date}`), orderBy('timeStamp', 'desc'));
    return onSnapshot(waterRecordQuery, (docRef) => {
        const docRefTemp = [];
        docRef.forEach((doc) => {
            docRefTemp.push({ id: doc.id, data: doc.data() })
        });
        dispatch(firebaseActions.fetchWaterRecords(docRefTemp));
    });
}

export const saveWaterRecord = (dispatch, userId, size) => {
    const today = moment().format("YYYY-MM-DD");
    const now = moment().format("HH:mm")
    return addDoc(collection(firestore, `${userId}/History/${today}`), {
        time: now,
        timeStamp: moment().format(),
        size: size
    }).then(() => {
        dispatch(firebaseActions.saveWaterRecords());
    }).catch((error) => {
        console.warn('Failed to save water record:', error);
    });
}

export const fetchWaterRecord = (dispatch, userId, date) => {
    const waterRecordQuery = query(collection(firestore, `${userId}/History/${date}`), orderBy('timeStamp', 'desc'));
    return onSnapshot(waterRecordQuery, (docRef) => {
        const docRefTemp = [];
        docRef.forEach((doc) => {
            docRefTemp.push({ id: doc.id, data: doc.data() })
        });
        dispatch(firebaseActions.fetchWaterRecord(docRefTemp));
    });
}


export const fetchWaterGoal = (dispatch, userId) => {
    const docRef = doc(firestore, userId, 'History');
    return onSnapshot(docRef, (docSnap) => {
        if (!docSnap.exists()) {
            const defaultGoal = { waterGoal: 2500 };
            setDoc(doc(firestore, userId, 'History'), defaultGoal).then(() => {
                dispatch(firebaseActions.saveWaterGoal(defaultGoal));
            });
        } else {
            dispatch(firebaseActions.fetchWaterGoal(docSnap.data()));
        }
    });
}

export const saveWaterGoal = (dispatch, userId, waterGoal) => {
    if (!userId) {
        return Promise.reject(new Error('User not signed in.'));
    }

    const normalizedGoal = Number(waterGoal) || 0;
    const payload = { waterGoal: normalizedGoal };

    // Update UI immediately (Optimistic Update)
    dispatch(firebaseActions.saveWaterGoal(payload));

    // Perform the actual save in the background
    return setDoc(doc(firestore, userId, 'History'), payload, { merge: true });
}
