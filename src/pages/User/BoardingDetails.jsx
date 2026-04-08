import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function BoardingDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const ref = doc(db, "boardingBookings", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const booking = snap.data();

        setData(booking);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  if (!data) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  // 🧠 Calculate duration
  const totalDays = Math.ceil(
    (new Date(data.endDate) - new Date(data.startDate)) / (1000 * 60 * 60 * 24),
  );

  return (
    <>
      <Navbar />

      <main className="fix">
        <section className="container mt-5">
          <h2 className="text-center mb-4">🏠 Boarding Details</h2>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="card shadow-lg p-4"
                style={{ borderRadius: "16px" }}
              >
                {/* PET INFO */}
                <div className="text-center mb-4">
                  <h3>{data.petName}</h3>
                  <p className="text-muted">{data.userEmail}</p>
                </div>

                <hr />

                {/* STATUS */}
                <div className="mb-4 text-center">
                  <span
                    className={`badge px-3 py-2 ${
                      data.status === "approved"
                        ? "bg-success"
                        : data.status === "active"
                          ? "bg-primary"
                          : data.status === "completed"
                            ? "bg-secondary"
                            : data.status === "cancelled"
                              ? "bg-danger"
                              : "bg-warning"
                    }`}
                    style={{ fontSize: "14px" }}
                  >
                    {data.status}
                  </span>
                </div>

                {/* BOOKING DETAILS */}
                <div
                  className="p-3 mb-3"
                  style={{ background: "#f9f9f9", borderRadius: "10px" }}
                >
                  <h6>📅 Booking Info</h6>

                  <p className="mb-1 text-muted">Start: {data.startDate}</p>

                  <p className="mb-1 text-muted">End: {data.endDate}</p>

                  <p className="mb-0 text-muted">Duration: {totalDays} days</p>
                </div>

                {/* CENTER DETAILS */}
                {data.status === "approved" ||
                data.status === "active" ||
                data.status === "completed" ? (
                  <div
                    className="p-3 mb-3"
                    style={{ background: "#f9f9f9", borderRadius: "10px" }}
                  >
                    <h6>🏠 Boarding Center</h6>

                    <p className="mb-1 text-muted">
                      {data.providerName || "PetPal Center"}
                    </p>

                    <p className="mb-1 text-muted">
                      {data.location || "Bakrol Square Complex, Anand"}
                    </p>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        data.location || "Bakrol Square Complex, Anand",
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-primary mt-2"
                    >
                      View on Map
                    </a>
                  </div>
                ) : null}

                {/* PAYMENT */}
                {(data.paidAmount || data.remainingAmount) && (
                  <div
                    className="p-3"
                    style={{ background: "#f9f9f9", borderRadius: "10px" }}
                  >
                    <h6>💳 Payment</h6>

                    <p className="mb-0 text-muted">
                      ₹{data.paidAmount || 0} paid • Remaining ₹
                      {data.remainingAmount || 0}
                    </p>
                  </div>
                )}

                {/* CANCELLED */}
                {data.status === "cancelled" && (
                  <div className="text-center mt-3">
                    <p className="text-danger">
                      ❌ Your boarding request was cancelled.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default BoardingDetails;
