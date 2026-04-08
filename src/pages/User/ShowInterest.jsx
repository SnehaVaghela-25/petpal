import { useUserStore } from "../../store/userStore";

import { startRazorpayPayment } from "../../utils/razorpay";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";

import { db } from "../../firebase/firebase";

import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import Swal from "sweetalert2";

function ShowInterest() {

  const [loading, setLoading] = useState(false);

  const currentUser = useUserStore((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");

  const [city, setCity] = useState("");
  const [livingCondition, setLivingCondition] = useState("");
  const [experience, setExperience] = useState("");
  const [otherPets, setOtherPets] = useState("");
  const [reason, setReason] = useState("");

  const location = useLocation();
  const { id } = useParams();

  const [pet, setPet] = useState(location.state?.pet || null);


  const navigate = useNavigate();

  /* FETCH PET */
  useEffect(() => {
    async function fetchPet() {
      if (!pet && id) {
        const docRef = doc(db, "pets", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPet({ id: docSnap.id, ...docSnap.data() });
        } else {
          Swal.fire("Error", "Pet not found", "error");
        }
      }
    }

    fetchPet();
  }, [id, pet]);

  /* SUBMIT */
  async function submitRequest(e) {
    e.preventDefault();

    /* VALIDATION */
    if (
      !name ||
      !email ||
      !mobile ||
      !city ||
      !livingCondition ||
      !experience ||
      !otherPets ||
      !reason
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill all fields before submitting.",
      });
      return;
    }

    if (!currentUser) {
      Swal.fire("Login Required", "", "warning");
      navigate("/login");
      return;
    }

    try {
      /* CHECK DUPLICATE */
      const q = query(
        collection(db, "adoptionRequest"),
        where("userId", "==", currentUser.uid),
        where("petId", "==", pet.id),
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        Swal.fire({
          icon: "info",
          title: "Already Requested",
          text: "You already sent a request for this pet.",
        });
        return;
      }

      const confirm = await Swal.fire({
        title: "Booking Confirmation",
        html: `
    <div style="text-align:center;">
      <p style="font-size:15px;">
        A refundable fee of <b style="color:#894B8D;">₹500</b> is required to proceed.
      </p>

      <div style="text-align:left; margin:15px 0; font-size:14px;">
        <p>✔ Helps reserve the pet</p>
        <p>✔ Prevents fake requests</p>
      </div>

      <p style="font-size:13px; color:#888;">
        This amount will be adjusted or returned if not approved.
      </p>
    </div>
  `,
        showCancelButton: true,
        confirmButtonText: "Continue Payment",
        cancelButtonText: "Cancel",
        background: "#fff",
        color: "#333",

        confirmButtonColor: "#894B8D", 
        cancelButtonColor: "#e0e0e0", 

        customClass: {
          confirmButton: "petpal-confirm-btn",
          cancelButton: "petpal-cancel-btn",
        },

        buttonsStyling: false, 
      });

      if (!confirm.isConfirmed) return;

      setLoading(true);
      /* 💳 STEP 2: PAYMENT */

      const paymentSuccess = await startRazorpayPayment({
        // amount: 500,
        amount: pet.bookingFee || 500,
        user: currentUser,
        serviceType: "adoption",
        referenceId: pet.id,
      });

      if (!paymentSuccess) return;

      await addDoc(collection(db, "adoptionRequest"), {
        userId: currentUser.uid,
        petId: pet.id,

        fullname: name,
        email: email,
        mobile: mobile,

        city: city,
        livingCondition: livingCondition,
        experience: experience,
        otherPets: otherPets,
        reason: reason,

        petName: pet.name,
        petImage: pet.image,

        paymentType: "advance",
        paidAmount: 500,
        // remainingAmount: (pet.price || 2000) - 500,
        remainingAmount: (pet.adoptionFee || 0) - (pet.bookingFee || 500),
        paymentStatus: "partial",
        status: "Pending",

        createdAt: serverTimestamp(),
      });
      Swal.fire({
        icon: "success",
        title: "Request Sent 🐾",
        text: "₹500 advance received. Complete remaining payment at the center.",
        confirmButtonColor: "#ff6b6b",
      });

      /* RESET */
      setName("");
      setEmail("");
      setMobile("");
      setCity("");
      setLivingCondition("");
      setExperience("");
      setOtherPets("");
      setReason("");
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title={"Pet Adoption"} />

        <section className="team__details-area">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div className="contact__form-wrap team__details-form">
                  {pet && (
                    <div className="pet-preview-box mb-4 text-center">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        style={{ width: "120px", borderRadius: "10px" }}
                      />
                      <h4 className="mt-2">{pet.name}</h4>
                    </div>
                  )}
                  <form onSubmit={submitRequest} className="contact__form">
                    <h2 className="title mb-3">Adoption Details</h2>

                    <div className="row gutter-20">
                      <div className="col-md-6">
                        <div className="form-grp">
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-grp">
                          <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="text"
                            placeholder="Living Condition (Apartment/House)"
                            value={livingCondition}
                            onChange={(e) => setLivingCondition(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="text"
                            placeholder="Do you have other pets?"
                            value={otherPets}
                            onChange={(e) => setOtherPets(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <select
                            className="form-control"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                          >
                            <option value="">Select Experience</option>
                            <option value="None">No Experience</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Experienced">Experienced</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <textarea
                            placeholder="Why do you want to adopt this pet?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="btn" disabled={loading}>
                      {/* Pay ₹500 in Advance & Send Request */}
                      {loading
                        ? "Processing..."
                        : `Pay ₹${pet?.bookingFee || 500} & Send Request`}
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
                      {/* ₹500 advance required. Remaining amount will be paid
                      during adoption. */}
                      ₹{pet?.bookingFee || 500} advance required. Remaining
                      amount will be paid during adoption.
                    </p>
                  </form>
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

export default ShowInterest;


