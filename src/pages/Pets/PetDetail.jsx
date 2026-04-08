import { useUserStore } from "../../store/userStore";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import Footer from "../../components/Footer";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Swal from "sweetalert2";

import { startRazorpayPayment } from "../../utils/razorpay";


function PetDetails() {
  const userStore = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const { id } = useParams();
  const [pet, setPet] = useState(null);

  const [alreadyRequested, setAlreadyRequested] = useState(false);

  useEffect(() => {
    const checkRequest = async () => {
      if (!userStore?.uid || !pet?.id) return;

      try {
        const q = query(
          collection(db, "adoptionRequest"),
          where("userId", "==", userStore.uid),
          where("petId", "==", pet.id),
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setAlreadyRequested(true);
        }
      } catch (err) {
        console.error("Error checking request:", err);
      }
    };

    checkRequest();
  }, [pet?.id, userStore?.uid]);

  useEffect(() => {
    async function fetchPet() {
      const docRef = doc(db, "pets", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPet({
          id: docSnap.id,
          ...docSnap.data(),
        });
      }
    }

    fetchPet();
  }, [id]);

  if (!pet) {
    return (
      <>
        <Navbar />
        <PageTitle title="Pet Details" />
        <div style={{ textAlign: "center", padding: "100px" }}>
          <h2>Loading...</h2>
        </div>
        <Footer />
      </>
    );
  }

  // async function handleAdoptionPayment(pet) {
  //   const success = await startRazorpayPayment({
  //     amount: pet.bookingFee || 500,
  //     user: userStore,
  //     serviceType: "adoption",
  //     referenceId: pet.id,
  //   });

  //   if (success) {
  //     console.log("Proceed with adoption request");
  //   }
  // }

async function handleAdoptionPayment(pet) {
  const success = await startRazorpayPayment({
    amount: pet.bookingFee || 500,
    user: userStore,
    serviceType: "adoption",
    referenceId: pet.id,
  });

  if (success) {
    Swal.fire({
      icon: "success",
      title: "Payment Successful 🎉",
      text: "Now fill adoption details",
      timer: 1500,
      showConfirmButton: false,
    });

    setTimeout(() => {
      navigate(`/showinterest/${pet.id}`);
    }, 1500);
  }
}

  return (
    <>
      {/* header-area */}
      <Navbar />
      {/* header-area-end */}
      {/* main-area */}
      <main className="fix">
        {/* breadcrumb-area */}
        <PageTitle title={"Pet Details"} />
        {/* breadcrumb-area-end */}
        {/* pet-details-area */}
        <section className="animal__details-area">
          <div className="container">
            <div className="animal__details-wrap">
              <div className="row">
                {/* LEFT SIDE - IMAGE */}
                <div className="col-lg-6">
                  <div className="animal__details-img-wrap ">
                    <img
                      src={pet.image || "/images/no-pet.png"}
                      alt={pet.name}
                      style={{
                        width: "100%",
                        height: "450px",
                        objectFit: "contain",
                        borderRadius: "12px",
                      }}
                    />
                  </div>
                </div>

                {/* RIGHT SIDE - PET INFO */}
                <div className="col-lg-6">
                  <div className="animal__details-content">
                    <span className="tag">{pet.breed}</span>

                    <h2 className="title mt-2">{pet.name}</h2>

                    <h5 className="mt-2">Gender: {pet.gender}</h5>

                    <p className="mt-2">
                      Location: {pet.location} <br />
                      Age: {pet.age} <br />
                      Weight: {pet.weight ? `${pet.weight} kg` : "N/A"}
                    </p>

                    {/* TEMPERAMENT */}
                    <div className="mt-3">
                      <strong>Temperament:</strong>
                      <div style={{ marginTop: "6px" }}>
                        {pet.temperament?.length ? (
                          pet.temperament.map((t, i) => (
                            <span
                              key={i}
                              style={{
                                display: "inline-block",
                                padding: "5px 10px",
                                margin: "3px",
                                background: "#e0f7fa",
                                borderRadius: "15px",
                                fontSize: "12px",
                              }}
                            >
                              {t}
                            </span>
                          ))
                        ) : (
                          <span> No data</span>
                        )}
                      </div>
                    </div>

                    {/* HEALTH */}
                    <div className="mt-3">
                      <strong>Health Status:</strong>
                      <ul style={{ marginTop: "6px" }}>
                        {pet.health?.vaccinated && <li>✔ Vaccinated</li>}
                        {pet.health?.dewormed && <li>✔ Dewormed</li>}
                        {pet.health?.vetChecked && <li>✔ Vet Checked</li>}
                      </ul>
                    </div>

                    {/* PRICE */}
                    <h4 className="price mt-3">
                      {/* Adoption Fee: ₹{pet.price || "0"} */}
                      {/* PRICE / PAYMENT */}
                      <div className="mt-3">
                        <h4>Adoption Details:</h4>

                        <p style={{ margin: 0 }}>
                          Adoption Fee: ₹{pet.adoptionFee || 0}
                        </p>

                        <p style={{ margin: 0 }}>
                          Booking Fee: ₹{pet.bookingFee || 500}
                        </p>

                        <p
                          style={{
                            margin: 0,
                            color: "green",
                            fontWeight: "bold",
                          }}
                        >
                          Remaining: ₹
                          {(pet.adoptionFee || 0) - (pet.bookingFee || 500)}{" "}
                          (pay at shelter)
                        </p>
                      </div>
                    </h4>

                    {/* BUTTON */}
                    <div className="mt-3">
                      {alreadyRequested ? (
                        <button className="btn btn-secondary" disabled>
                          Request Already Sent
                        </button>
                      ) : (
                        <button
                          className="btn"
                          onClick={() => {
                            if (!userStore?.uid) {
                              Swal.fire({
                                icon: "warning",
                                title: "Login Required",
                                text: "Please login to adopt this pet 🐾",
                              });
                              return;
                            }

                            navigate(`/showinterest/${id}`);
                          }}
                        >
                          Adopt Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="animal__details-description mt-5">
                <h4 className="title">Description</h4>
                <p>{pet.description}</p>
              </div>

              {/* EXTRA INFO */}
              <div className="animal__details-info-wrap mt-4">
                <h4 className="title">Additional Information</h4>

                <div className="introducing__list-box">
                  <ul className="list-wrap">
                    <li>✔ Adoption Support Available</li>
                    <li>✔ Verified Listing</li>
                    <li>✔ Secure Booking Process</li>
                    <li>✔ Shelter Pickup Assistance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* product-details-area-end */}
      </main>
      {/* main-area-end */}
      {/* footer-area */}
      <Footer />
    </>
  );
}
export default PetDetails;
