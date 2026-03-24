import { db } from "../firebase/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createOrder = async (userId, cartItems, total) => {
  const order = {
    userId,
    items: cartItems,
    total,
    status: "paid",
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "orders"), order);
};
