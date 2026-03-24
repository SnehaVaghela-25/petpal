import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function BookingDetails() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "serviceBookings", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setBooking(snap.data());
      }
    };

    fetchData();
  }, [id]);

  if (!booking) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        <section className="container mt-5">
          <h2 className="text-center mb-4">🐾 Service Booking Details</h2>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="card shadow-lg p-4"
                style={{ borderRadius: "16px" }}
              >
                {/* HEADER */}
                <div className="text-center mb-3">
                  <h3>{booking.serviceName}</h3>
                  <p className="text-muted">
                    For <b>{booking.petName}</b>
                  </p>
                </div>

                {/* STATUS */}
                <div className="text-center mb-4">
                  <span
                    className={`badge px-3 py-2 ${
                      booking.status === "confirmed"
                        ? "bg-success"
                        : booking.status === "pending"
                          ? "bg-warning"
                          : "bg-secondary"
                    }`}
                    style={{ fontSize: "14px" }}
                  >
                    {booking.status}
                  </span>
                </div>

                <hr />

                {/* BASIC INFO */}
                <div className="mb-4">
                  <h6>📅 Booking Info</h6>
                  <p className="mb-1 text-muted">
                    <b>Date:</b> {booking.date}
                  </p>
                </div>

                {/* CONFIRMED DETAILS */}
                {booking.status === "confirmed" && (
                  <div
                    className="p-3 mb-3"
                    style={{
                      background: "#f9f9f9",
                      borderRadius: "10px",
                    }}
                  >
                    {/* PROVIDER */}
                    <div className="mb-3">
                      <h6>🏥 Service Provider</h6>
                      <p className="mb-0 text-muted">
                        {booking.providerName || "PetPal Center"}
                      </p>
                    </div>

                    {/* LOCATION */}
                    <div className="mb-3">
                      <h6>📍 Location</h6>
                      <p className="mb-1 text-muted">
                        {booking.location || "Not assigned"}
                      </p>

                      {booking.location && (
                        <a
                          href={`https://maps.google.com/?q=${encodeURIComponent(
                            booking.location,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-primary mt-2"
                        >
                          View on Map
                        </a>
                      )}
                    </div>

                    {/* PAYMENT */}
                    <div>
                      <h6>💳 Payment</h6>
                      <p className="mb-0 text-muted">
                        ₹{booking.paidAmount} paid • Remaining ₹
                        {booking.remainingAmount}
                      </p>
                    </div>
                  </div>
                )}

                {/* PENDING STATE */}
                {booking.status === "pending" && (
                  <div className="text-center mt-3">
                    <p className="text-warning">
                      ⏳ Your booking is pending confirmation
                    </p>
                    <p className="text-muted" style={{ fontSize: "14px" }}>
                      You will receive provider & location details soon.
                    </p>
                  </div>
                )}

                {/* COMPLETED STATE */}
                {booking.status === "completed" && (
                  <div className="text-center mt-3">
                    <p className="text-success">
                      ✅ Service completed successfully!
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

export default BookingDetails;
