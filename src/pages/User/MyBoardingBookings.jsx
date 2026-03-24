import { useUserStore } from "../../store/userStore";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function MyBoardingBookings() {
  const user = useUserStore((state) => state.user);

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user?.uid) {
      setBookings([]);
      return;
    }

    async function fetchBookings() {
      try {
        const q = query(
          collection(db, "boardingBookings"),
          where("userId", "==", user.uid),
        );

        const snap = await getDocs(q);

        setBookings(
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
      } catch (error) {
        console.error(error);
      }
    }

    fetchBookings();
  }, [user]); 

  return (
    <div className="container py-5">
      <h3>My Boarding Requests</h3>

      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Pet</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.petName}</td>

              <td>{b.startDate}</td>

              <td>{b.endDate}</td>

              <td>
                <span className="badge bg-warning">{b.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
