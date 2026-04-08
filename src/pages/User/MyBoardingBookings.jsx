import { useUserStore } from "../../store/userStore";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning";
      case "approved":
        return "bg-success";
      case "active":
        return "bg-primary";
      case "completed":
        return "bg-secondary";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-dark";
    }
  };

  return (
    <>
      <Navbar />

      <main className="fix">
        {/* HEADER */}
        <section
          className="banner__area-two"
          style={{ paddingTop: "120px", paddingBottom: "80px" }}
        >
          <div className="container text-center">
            <h2 className="title">My Boarding Bookings</h2>
            <p>Track your pet boarding requests easily.</p>
          </div>
        </section>

        {/* TABLE */}
        <section className="container mb-5">
          <div className="card shadow-lg p-4" style={{ borderRadius: "16px" }}>
            <h4 className="mb-4">All Bookings</h4>

            {bookings.length === 0 ? (
              <p className="text-center">No boarding bookings found.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Pet</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((b, index) => (
                      <tr key={b.id}>
                        <td>{index + 1}</td>

                        <td>
                          <strong>{b.petName}</strong>
                        </td>

                        <td>{b.startDate}</td>

                        <td>{b.endDate}</td>

                        <td>
                          <span className={`badge ${getStatusBadge(b.status)}`}>
                            {b.status}
                          </span>
                        </td>

                        <td>
                          <Link
                            to={`/boarding/${b.id}`}
                            className="btn btn-sm btn-dark"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
