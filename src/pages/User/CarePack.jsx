import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CarePack() {
  const { petId } = useParams();
  const [carePack, setCarePack] = useState(null);

  useEffect(() => {
    const fetchCarePack = async () => {
      if (!auth.currentUser) return;

      const q = query(
        collection(db, "pet_care_packs"),
        where("petId", "==", petId),
        where("userId", "==", auth.currentUser.uid),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setCarePack(snapshot.docs[0].data());
      }
    };

    fetchCarePack();
  }, [petId]);

  if (!carePack) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "120px" }}>
          <h3>🐾 No Care Pack Found</h3>
          <p>Please adopt a pet to unlock care instructions.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        {/* Banner */}
        <section
          className="banner__area-two"
          style={{ paddingTop: "120px", paddingBottom: "80px" }}
        >
          <div className="container text-center">
            <h2 className="title">🐾 Pet Care Pack</h2>
            <p>Everything you need to keep your pet healthy & happy</p>
          </div>
        </section>

        {/* Main Card */}
        <section className="container mb-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div
                className="card shadow-lg p-4"
                style={{ borderRadius: "15px" }}
              >
                {/* Pet Info */}
                <div className="text-center mb-4">
                  <img
                    src={carePack.petImage}
                    alt={carePack.petName}
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "5px solid #f5f5f5",
                    }}
                  />

                  <h3 className="mt-3">{carePack.petName}</h3>
                </div>

                {/* Care Sections */}
                <div className="row g-3 mt-3">
                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>⏰ Feeding Schedule</h5>
                      <p>{carePack.feedingSchedule}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>💧 Water</h5>
                      <p>{carePack.water}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>💉 Vaccination</h5>
                      <p>{carePack.vaccination}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>🪱 Deworming</h5>
                      <p>{carePack.deworming}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>🚫 Foods to Avoid</h5>
                      <p>{carePack.foodsToAvoid}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>✂ Grooming</h5>
                      <p>{carePack.grooming}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>🧠 Behavior</h5>
                      <p>{carePack.behavior}</p>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                      <h5>🎯 Training</h5>
                      <p>{carePack.training}</p>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card p-3 shadow-sm">
                      <h5>🚨 Emergency Care</h5>
                      <p>{carePack.emergency}</p>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="card p-3 shadow-sm">
                      <h5>🏥 Vet Contact</h5>
                      <p>{carePack.vetContact}</p>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-4">
                  {/* <p style={{ color: "#888", fontSize: "14px" }}>
                    Generated on:{" "}
                    {carePack.createdAt?.toDate().toLocaleString() || "N/A"}
                  </p> */}

                  <button
                    className="btn mt-2 btn-theme"
                    style={{
                      color: "#fff",
                      borderRadius: "25px",
                      padding: "8px 20px",
                    }}
                    onClick={() => window.print()}
                  >
                    🖨 Print Care Pack
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
