// import { db } from "../firebase/firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";

// export const getProducts = async () => {
//   const q = query(collection(db, "products"), where("isActive", "==", true));

//   const snapshot = await getDocs(q);

//   const products = [];

//   snapshot.forEach((doc) => {
//     products.push({
//       id: doc.id,
//       ...doc.data(),
//     });
//   });

//   return products;
// };

import { db } from "../firebase/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const getProducts = async () => {
  const q = query(collection(db, "products"), where("isActive", "==", true));

  const snapshot = await getDocs(q);

  const products = [];

  snapshot.forEach((doc) => {
    products.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  return products;
};