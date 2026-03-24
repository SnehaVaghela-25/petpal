import { db } from "../firebase/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const serviceCollection = collection(db, "services");
const bookingCollection = collection(db, "serviceBookings");


export const getServices = async () => {
  const snapshot = await getDocs(serviceCollection);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getServiceById = async (id) => {
  const docRef = doc(db, "services", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  }

  return null;
};


export const bookService = async (bookingData) => {
  return await addDoc(bookingCollection, {
    ...bookingData,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
