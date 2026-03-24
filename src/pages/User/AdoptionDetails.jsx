import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function AdoptionDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const ref = doc(db, "adoptionRequest", id);
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const request = snap.data();

        // fetch pet details
        const petRef = doc(db, "pets", request.petId);
        const petSnap = await getDoc(petRef);

        setData({
          ...request,
          pet: petSnap.exists() ? petSnap.data() : null,
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  if (!data) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        <section className="container mt-5">
          <h2 className="text-center mb-4">🐾 Adoption Details</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="card shadow-lg p-4"
                style={{ borderRadius: "16px" }}
              >
                {/* PET HEADER */}
                {data.pet && (
                  <div className="text-center mb-4">
                    <img
                      src={data.pet.image}
                      alt={data.pet.name}
                      style={{
                        width: "180px",
                        height: "180px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <h3 className="mt-3">{data.pet.name}</h3>
                    <p className="text-muted">
                      {data.pet.breed} • {data.pet.categoryName}
                    </p>
                  </div>
                )}

                <hr />

                {/* STATUS */}
                <div className="mb-4 text-center">
                  <span
                    className={`badge px-3 py-2 ${
                      data.status?.toLowerCase() === "approved"
                        ? "bg-success"
                        : data.status?.toLowerCase() === "rejected"
                          ? "bg-danger"
                          : "bg-warning"
                    }`}
                    style={{ fontSize: "14px" }}
                  >
                    {data.status}
                  </span>
                </div>

                {/* APPROVED DETAILS */}
                {data.status?.toLowerCase() === "approved" && (
                  <div
                    className="p-3"
                    style={{ background: "#f9f9f9", borderRadius: "10px" }}
                  >
                    {/* LOCATION */}
                    <div className="mb-3">
                      <h6>📍 Pickup Location</h6>
                      <p className="mb-1 text-muted">
                        {data.centerAddress || "Address not available"}
                      </p>

                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(
                          data.centerAddress || "",
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary mt-2"
                      >
                        View on Map
                      </a>
                    </div>

                    {/* PICKUP SCHEDULE */}
                    <div className="mb-3">
                      <h6>📅 Pickup Schedule</h6>

                      <p className="mb-1 text-muted">
                        {data.pickupDate
                          ? new Date(
                              data.pickupDate.seconds * 1000,
                            ).toLocaleDateString()
                          : "Not assigned"}
                      </p>

                      <p className="mb-0 text-muted">
                        {data.pickupTime || "Not assigned"}
                      </p>
                    </div>
                    
                    {/* CONTACT */}
                    <div className="mb-3">
                      <h6>📞 Contact</h6>
                      <p className="mb-0 text-muted">
                        {data.contactNumber || "Not available"}
                      </p>
                    </div>

                    {/* PAYMENT INFO */}
                    <div>
                      <h6>💳 Payment</h6>
                      <p className="mb-0 text-muted">
                        ₹{data.paidAmount} paid • Remaining ₹
                        {data.remainingAmount}
                      </p>
                    </div>
                  </div>
                )}

                {/* REJECTED STATE */}
                {data.status?.toLowerCase() === "rejected" && (
                  <div className="text-center mt-3">
                    <p className="text-danger">
                      ❌ Your request was not approved.
                    </p>
                    <p className="text-muted" style={{ fontSize: "14px" }}>
                      ₹500 will be refunded or returned at the center.
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

export default AdoptionDetails;
