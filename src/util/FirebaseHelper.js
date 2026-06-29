import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import { firebaseActions } from "../context/FirebaseContext";
import moment from "moment";

/**
 * PATH STRUCTURE:
 * users/{userId}/Settings/History (Doc)
 * users/{userId}/WaterHistory/{date}/Entries (Collection)
 * users/{userId}/GoalHistory/{date} (Doc)
 */

const getUserHistoryRef = (userId) => doc(firestore, "users", userId, "Settings", "History");
const getWaterRecordsRef = (userId, date) => collection(firestore, "users", userId, "WaterHistory", date, "Entries");
const getGoalHistoryRef = (userId, date) => doc(firestore, "users", userId, "GoalHistory", date);

export const fetchWaterRecords = (dispatch, userId, date = moment().format("YYYY-MM-DD")) => {
    if (!userId) return () => {};
    // Using 5 segments path (users/uid/WaterHistory/date/Entries) - This is ODD and valid
    const waterRecordQuery = query(getWaterRecordsRef(userId, date), orderBy('timeStamp', 'desc'));
    return onSnapshot(waterRecordQuery, (docRef) => {
        const docRefTemp = [];
        docRef.forEach((doc) => {
            docRefTemp.push({ id: doc.id, data: doc.data() })
        });
        dispatch(firebaseActions.fetchWaterRecords(docRefTemp));
    });
}

export const saveWaterRecord = (dispatch, userId, size) => {
    if (!userId) return Promise.reject();
    const today = moment().format("YYYY-MM-DD");
    return addDoc(getWaterRecordsRef(userId, today), {
        time: moment().format("HH:mm"),
        timeStamp: moment().format(),
        size: size
    }).then(() => {
        dispatch(firebaseActions.saveWaterRecords());
    });
}

export const fetchWaterGoal = (dispatch, userId) => {
    if (!userId) return () => {};
    return onSnapshot(getUserHistoryRef(userId), (docSnap) => {
        if (!docSnap.exists()) {
            const defaultGoal = { waterGoal: 0 };
            setDoc(getUserHistoryRef(userId), defaultGoal).then(() => {
                dispatch(firebaseActions.saveWaterGoal(defaultGoal));
            });
        } else {
            dispatch(firebaseActions.fetchWaterGoal(docSnap.data()));
        }
    });
}

export const saveWaterGoal = (dispatch, userId, waterGoal) => {
    if (!userId) return Promise.reject();
    const payload = { waterGoal: Number(waterGoal) || 0 };
    dispatch(firebaseActions.saveWaterGoal(payload));
    return setDoc(getUserHistoryRef(userId), payload, { merge: true });
}

export const saveGoalReached = (userId, date) => {
    if (!userId) return Promise.resolve();
    return setDoc(getGoalHistoryRef(userId, date), {
        completed: true,
        timestamp: moment().format()
    }, { merge: true });
}

export const fetchGoalHistory = (dispatch, userId) => {
    if (!userId) return () => {};
    const historyQuery = query(collection(firestore, "users", userId, "GoalHistory"));
    return onSnapshot(historyQuery, (snapshot) => {
        const history = [];
        snapshot.forEach(doc => history.push(doc.id));
        dispatch(firebaseActions.saveDailyWaterGoalReached(history));
    });
}
