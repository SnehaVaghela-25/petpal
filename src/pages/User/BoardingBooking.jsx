import { useUserStore } from "../../store/userStore";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";

import Swal from "sweetalert2";

import { startRazorpayPayment } from "../../utils/razorpay";

export default function BoardingBooking() {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");

  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const [totalPrice, setTotalPrice] = useState(0);
  const pricePerDay = 500;


  useEffect(() => {
    async function fetchPets() {
      if (!user?.uid) return;

      const q = query(
        collection(db, "userPets"),
        where("ownerId", "==", user.uid),
      );

      const snap = await getDocs(q);

      setPets(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    }

    fetchPets();
  }, [user]);


  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffTime = end - start;

      const days = diffTime / (1000 * 60 * 60 * 24);

     if (days > 0) {
       setTotalPrice(days * pricePerDay);
     } else {
       setTotalPrice(0);
     }
    }
  }, [startDate, endDate]);

  const advanceAmount = 200; // fixed advance

 async function handleSubmit(e) {
   e.preventDefault();

   // 🔴 LOGIN CHECK
   if (!user) {
     Swal.fire({
       icon: "warning",
       title: "Login Required",
       text: "Please login to continue",
     });
     navigate("/login");
     return;
   }

   // 🔴 DATE VALIDATION
   if (!startDate || !endDate || totalPrice <= 0) {
     Swal.fire({
       icon: "warning",
       title: "Invalid Booking",
       text: "Please select valid dates",
     });
     return;
   }

   if (loading) return;

   // 🔴 PET VALIDATION FIRST (VERY IMPORTANT)
   let petData = {};

   if (selectedPet === "new") {
     if (!petName || !petType) {
       Swal.fire("Error", "Enter pet details", "error");
       return;
     }

     petData = {
       petId: null,
       petName,
       petType,
     };
   } else {
     const pet = pets.find((p) => p.id === selectedPet);

     if (!pet) {
       Swal.fire("Error", "Select a pet", "error");
       return;
     }

     petData = {
       petId: pet.id,
       petName: pet.name,
       petType: pet.type,
     };
   }

   setLoading(true);

   try {
     // 🟡 PAYMENT AFTER VALIDATION
     const result = await startRazorpayPayment({
       amount: advanceAmount,
       user,
       serviceType: "boarding",
       referenceId: "temp_booking",
     });

     if (!result?.success) return;

     // 🟢 SAVE BOOKING
     await addDoc(collection(db, "boardingBookings"), {
       userId: user.uid,
       userEmail: user.email,
       ...petData,
       startDate,
       endDate,
       notes,
       totalAmount: totalPrice,
       paidAmount: advanceAmount,
       remainingAmount: totalPrice - advanceAmount,
       paymentType: "advance",
       paymentStatus: "partial",
       status: "pending",
       createdAt: serverTimestamp(),
     });

     // ✅ NAVIGATE
     navigate("/paymentsuccess", {
       state: result,
     });

     Swal.fire({
       icon: "success",
       title: "Booking Confirmed 🐾",
     });
   } catch (error) {
     console.error(error);

     Swal.fire({
       icon: "error",
       title: "Something went wrong",
     });
   } finally {
     setLoading(false);
   }
 }

  function handleCancel() {
    Swal.fire({
      title: "Cancel Booking?",
      text: "All entered details will be cleared.",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setSelectedPet("");
        setPetName("");
        setPetType("");
        setStartDate("");
        setEndDate("");
        setNotes("");
        setTotalPrice(0);

        Swal.fire("Cleared!", "", "success");
      }
    });
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title={"Pet Boarding"} />

        <section className="registration__area-two">
          <div className="container">
            <div className="registration__inner-wrap-two">
              <div className="row ustify-content-center">
                {/* FORM */}

                <div className="col-lg-8">
                  <div className="registration__form-wrap">
                    {/* {success && (
                      <div className="alert alert-success">
                        🐾 Boarding request submitted! We will contact you soon.
                      </div>
                    )} */}

                    <form
                      className="registration__form"
                      onSubmit={handleSubmit}
                    >
                      <h3 className="title">Book Pet Boarding</h3>

                      <div className="row gutter-20">
                        {/* SELECT PET */}

                        <div className="col-md-12">
                          <h5 className="mb-3">Select Your Pet</h5>

                          <div className="pet-grid">
                            {pets.map((pet) => (
                              <div
                                key={pet.id}
                                className={`pet-card ${selectedPet === pet.id ? "active" : ""}`}
                                onClick={() => setSelectedPet(pet.id)}
                              >
                                <img
                                  src={
                                    pet.type?.toLowerCase() === "cat"
                                      ? "https://cdn-icons-png.flaticon.com/512/1864/1864514.png"
                                      : "https://cdn-icons-png.flaticon.com/512/616/616408.png"
                                  }
                                  alt={pet.name}
                                />

                                <p>{pet.name}</p>
                              </div>
                            ))}

                            {/* ADD NEW PET OPTION */}

                            <div
                              className={`pet-card add-pet ${
                                selectedPet === "new" ? "active" : ""
                              }`}
                              onClick={() => setSelectedPet("new")}
                            >
                              <span>+</span>

                              <p>Board New Pet</p>
                            </div>
                          </div>
                        </div>

                        {selectedPet === "new" && (
                          <div className="row gutter-20 mt-3">
                            <div className="col-md-6">
                              <div className="form-grp">
                                <input
                                  type="text"
                                  placeholder="Pet Name"
                                  value={petName}
                                  onChange={(e) => setPetName(e.target.value)}
                                  required
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-grp">
                                <input
                                  type="text"
                                  placeholder="Pet Type (Dog, Cat, Bird...)"
                                  value={petType}
                                  onChange={(e) => setPetType(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* START DATE */}

                        <div className="col-md-6">
                          <div className="form-grp">
                            <label>Start Date</label>

                            <input
                              type="date"
                              className="petpal-input"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <label>End Date</label>

                            <input
                              type="date"
                              className="petpal-input"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {totalPrice > 0 && (
                          <div className="col-md-12">
                            <div className="boarding-price-box">
                              <h5>Boarding Cost</h5>

                              <p>₹{pricePerDay} / day</p>

                              <h4>Total: ₹{totalPrice}</h4>
                            </div>
                          </div>
                        )}
                        {/* NOTES */}

                        <div className="col-md-12">
                          <div className="form-grp">
                            <textarea
                              placeholder="Special Notes"
                              rows="4"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <button className="btn">
                        {loading ? "Processing..." : `Pay ₹${advanceAmount} Advance & Book Now`}
                        <img
                          src="/assets/img/icon/right_arrow.svg"
                          alt=""
                          className="injectable"
                        />
                      </button>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#888",
                          marginTop: "10px",
                        }}
                      >
                        ₹{advanceAmount} advance required. Remaining amount will
                        be paid at center.
                      </p>
                    </form>
                  </div>
                </div>

                {/* IMAGE SIDE */}

                <div className="col-lg-4">
                  <div className="registration__img">
                    <img
                      src="/assets/images/services/boardng.jpg"
                      alt="Pet Boarding"
                    />
                  </div>
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
