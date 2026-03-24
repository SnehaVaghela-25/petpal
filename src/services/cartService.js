import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const fetchCartFromDB = async (uid) => {
  const cartRef = doc(db, "carts", uid);
  const snapshot = await getDoc(cartRef);

  if (snapshot.exists()) {
    return snapshot.data().items || [];
  }

  await setDoc(cartRef, { items: [] });
  return [];
};

export const saveCartToDB = async (uid, cartItems) => {
  const cartRef = doc(db, "carts", uid);
  await updateDoc(cartRef, { items: cartItems });
};
