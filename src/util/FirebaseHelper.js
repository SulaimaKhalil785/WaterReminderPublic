import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { firebaseActions } from "../context/FirebaseContext";
import moment from "moment";

const noop = () => { };

const isValidRequest = (dispatch, userId) => {
    return typeof dispatch === 'function' && Boolean(userId);
};

export const fetchWaterRecords = (dispatch, userId) => {
    if (!isValidRequest(dispatch, userId)) {
        return noop;
    }

    const today = moment().format("YYYY-MM-DD");
    const waterRecordQuery = query(collection(firestore, `${userId}/History/${today}`), orderBy('timeStamp', 'desc'));
    return onSnapshot(
        waterRecordQuery,
        (docRef) => {
            const docRefTemp = [];
            docRef.forEach((doc) => {
                docRefTemp.push({ id: doc.id, data: doc.data() })
            });
            dispatch(firebaseActions.fetchWaterRecords(docRefTemp));
        },
        (error) => {
            console.warn('Failed to fetch water records:', error);
        }
    );
}

export const saveWaterRecord = (dispatch, userId, size) => {
    if (!isValidRequest(dispatch, userId)) {
        return Promise.resolve();
    }

    const today = moment().format("YYYY-MM-DD");
    const now = moment().format("HH:mm")
    return addDoc(collection(firestore, `${userId}/History/${today}`), {
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
        if (!isValidRequest(dispatch, userId) || !date) {
            return noop;
        }

        const waterRecordQuery = query(collection(firestore, `${userId}/History/${date}`), orderBy('timeStamp', 'desc'));
        return onSnapshot(
            waterRecordQuery,
            (docRef) => {
                const docRefTemp = [];
                docRef.forEach((doc) => {
                    docRefTemp.push({ id: doc.id, data: doc.data() })
                });
                dispatch(firebaseActions.fetchWaterRecord(docRefTemp));
            },
            (error) => {
                console.warn('Failed to fetch water record:', error);
            }
        );
    }


    export const fetchWaterGoal = (dispatch, userId) => {
        if (!isValidRequest(dispatch, userId)) {
            return noop;
        }

        const waterGoalRef = doc(firestore, `${userId}/History`);
        return onSnapshot(
            waterGoalRef,
            (docRef) => {
                if (docRef.data() === undefined) {
                    setDoc(waterGoalRef, {
                        waterGoal: 0
                    }).then(() => {
                        dispatch(firebaseActions.saveWaterGoal({ waterGoal: 0 }));
                    }).catch((error) => {
                        console.warn('Failed to create default water goal:', error);
                    });
                } else {
                    dispatch(firebaseActions.fetchWaterGoal(docRef.data()));
                }
            },
            (error) => {
                console.warn('Failed to fetch water goal:', error);
            }
        );
    }

    export const saveWaterGoal = (dispatch, userId, waterGoal) => {
        if (!isValidRequest(dispatch, userId)) {
            return Promise.resolve();
        }

        return setDoc(doc(firestore, `${userId}/History`), {
            waterGoal: waterGoal
        }).then(() => {
            dispatch(firebaseActions.saveWaterGoal({ waterGoal }));
        }).catch((error) => {
            console.warn('Failed to save water goal:', error);
        });
    }

