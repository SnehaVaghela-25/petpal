  import { useUserStore } from "../store/userStore";
  
  import { useEffect, useState } from "react";

  import { doc, getDoc } from "firebase/firestore";
  import { db } from "../firebase/firebase";
  import { collection, query, where, getDocs } from "firebase/firestore";
  import { NavLink, useNavigate } from "react-router-dom";

  import Navbar from "../components/Navbar";
  import Footer from "../components/Footer";

  function Dashboard() {

    const navigate = useNavigate();

    const [pets, setPets] = useState([]);

    const [healthAlerts, setHealthAlerts] = useState([]);

    const [boardingBookings, setBoardingBookings] = useState([]);

    const [dailyTip, setDailyTip] = useState(null);

    const user = useUserStore((state) => state.user);

    useEffect(() => {
      if (!user?.uid) {
        setPets([]);
        setHealthAlerts([]);
        setBoardingBookings([]);
        return;
      }

      async function loadDashboard() {
        try {
          
          const petQuery = query(
            collection(db, "userPets"),
            where("ownerId", "==", user.uid),
          );

          const petSnapshot = await getDocs(petQuery);

          const userPets = petSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            categoryName: doc.data().category,
            image: null,
            adopted: false,
          }));

          const adoptedPets = await fetchAdoptedPets(user);

          const mergedPets = [...userPets];

          adoptedPets.forEach((pet) => {
            if (!mergedPets.find((p) => p.id === pet.id)) {
              mergedPets.push(pet);
            }
          });

          setPets(mergedPets);

          

          // 🟢 OTHER DATA
          await fetchHealthAlerts(mergedPets);
          await fetchBoardingBookings(user);
          await fetchDailyTip();
        } catch (error) {
          console.error(error);
        }
      }

      loadDashboard();
    }, [user]);
   
    // async function fetchAdoptedPets(user) {
    //   const q = query(
    //     collection(db, "adoptionRequest"),
    //     where("userId", "==", user.uid),
    //     where("status", "==", "approved"),
    //   );

    //   const snapshot = await getDocs(q);

    //   const adoptedPets = snapshot.docs.map((doc) => ({
    //     id: doc.data().petId,
    //     name: doc.data().petName,
    //     categoryName: doc.data().category,
    //     breed: doc.data().breed,
    //     adopted: true,
    //     image: doc.data().image || null,
    //   }));

    //   return adoptedPets;
    // }
async function fetchAdoptedPets(user) {
  // 1. Get all adoption records
  const adoptionSnap = await getDocs(
    query(collection(db, "adoptionRequest"), where("userId", "==", user.uid)),
  );

  const adoptionData = adoptionSnap.docs.map((doc) => doc.data());

  console.log("Adoption Data:", adoptionData);

  // 2. Get all care packs once
  const careSnap = await getDocs(
    query(collection(db, "pet_care_packs"), where("userId", "==", user.uid)),
  );

  const careMap = {};
  careSnap.forEach((doc) => {
    const d = doc.data();
    careMap[d.petId] = d;
  });

  // 3. Merge
  const adoptedPets = adoptionData.map((data) => ({
    id: data.petId,
    name: data.petName,
    categoryName: data.category,
    breed: data.breed,
    adopted: true,
    image: careMap[data.petId]?.petImage || null,
  }));

  return adoptedPets;
}
    async function fetchHealthAlerts(userPetsList) {
      let alerts = [];

      for (const pet of userPetsList) {
        const vacQuery = query(
          collection(db, "petHealthRecords"),
          where("petId", "==", pet.id),
        );

        const vacSnapshot = await getDocs(vacQuery);

        vacSnapshot.forEach((doc) => {
          const vac = doc.data();

          if (!vac.nextDueDate) return;

          const dueDate = new Date(
            vac.nextDueDate.seconds
              ? vac.nextDueDate.seconds * 1000
              : vac.nextDueDate,
          );

          const today = new Date();

          const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

          if (diff <= 7 && diff >= 0) {
            alerts.push({
              petName: pet.name,
              vaccine: vac.vaccineName,
              days: diff,
            });
          }
        });
      }

      setHealthAlerts(alerts);
    }
 
    async function fetchBoardingBookings(user) {
   const q = query(
     collection(db, "boardingBookings"),
     where("userId", "==", user.uid),
   );

   const snap = await getDocs(q);

   const bookings = snap.docs.map((doc) => ({
     id: doc.id,
     ...doc.data(),
   }));

   setBoardingBookings(bookings);
    }

    async function fetchDailyTip() {
      const snapshot = await getDocs(collection(db, "petTips"));

      const tips = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (tips.length > 0) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        setDailyTip(randomTip);
      }
    }


    return (
      <>
        <Navbar />

        <main className="fix">
          {/* Dashboard Banner */}

          <section
            className="banner__area-two"
            style={{ paddingTop: "120px", paddingBottom: "80px" }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <h2 className="title">🐾 My Pets</h2>

                  <p>
                    View your pets, track health records, manage boarding
                    requests, and keep your furry friends happy with PetPal.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Health Alerts */}

          {healthAlerts.length > 0 && (
            <section className="container mb-5">
              <div className="alert alert-warning">
                <strong>⚠ Vaccine Reminder</strong>

                <ul className="mb-0 mt-2">
                  {healthAlerts.map((alert, index) => (
                    <li key={index}>
                      🐾 {alert.petName} needs <b>{alert.vaccine}</b> vaccine in{" "}
                      {alert.days} days
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Pet Care Tip of the Day */}

          {dailyTip && (
            <section className="container mb-5">
              <div className="card shadow-sm p-4">
                <div className="row align-items-center">
                  <div className="col-md-3 text-center">
                    <img
                      src={dailyTip.image}
                      alt={dailyTip.title}
                      style={{ maxWidth: "120px", borderRadius: "10px" }}
                    />
                  </div>

                  <div className="col-md-9">
                    <h4 className="mb-2">💡 Pet Care Tip</h4>

                    <h5>{dailyTip.title}</h5>

                    <p className="text-muted mb-0">{dailyTip.description}</p>
                  </div>
                </div>
              </div>
            </section>
          )}
          {/* Pets Section */}
          <section className="team__area-two">
            <div className="container">
              <div className="section__title text-center mb-40">
                <span className="sub-title">My Pets</span>
                
              </div>

              <div className="row justify-content-center">
                {pets.length === 0 ? (
                  <p className="text-center">No pets added yet.</p>
                ) : (
                  pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-8"
                    >
                      <div className="team__item">
                        <div className="team__item-img">
                          <div className="mask-img-wrap">
                            <NavLink to={`/pet-health/${pet.id}`}>
                              <img
                                src={
                                  pet.image
                                    ? pet.image
                                    : pet.categoryName?.toLowerCase() === "dog"
                                      ? "/assets/img/pets/dog.png"
                                      : pet.categoryName?.toLowerCase() ===
                                          "cat"
                                        ? "/assets/img/pets/cat.png"
                                        : pet.categoryName?.toLowerCase() ===
                                            "rabbit"
                                          ? "/assets/img/pets/rabbit.png"
                                          : "/assets/img/pet_placeholder.png"
                                }
                                className={
                                  pet.image ? "pet-real-img" : "pet-icon-img"
                                }
                                alt={pet.name}
                              />
                            </NavLink>
                          </div>
                        </div>

                        <div className="team__item-content text-center">
                          {/* Ownership label */}
                          <div className="pet-status">
                            {pet.adopted ? (
                              <span className="pet-badge adopted">Adopted</span>
                            ) : (
                              <span className="pet-badge owned">My Pet</span>
                            )}
                          </div>

                          {/* Name with icon */}
                          <h4 className="title pet-title">
                            {pet.categoryName?.toLowerCase() === "dog" && "🐶"}
                            {pet.categoryName?.toLowerCase() === "cat" && "🐱"}
                            {pet.categoryName?.toLowerCase() === "rabbit" &&
                              "🐰"}
                            {pet.name}
                          </h4>

                          <NavLink
                            to={`/pet-health/${pet.id}`}
                            className="btn mt-2"
                          >
                            View Health
                          </NavLink>
                          {pet.adopted && (
                            <button
                              className="btn mt-2 ms-2 btn-theme"
                              onClick={() => navigate(`/care-pack/${pet.id}`)}
                            >
                              Care Pack
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Boarding Requests Cards */}

          {boardingBookings.length > 0 && (
            <section className="container mt-5">
              <div className="section__title text-center mb-40">
                <span className="sub-title">Pet Boarding</span>
                <h2 className="title">My Boarding Requests</h2>
              </div>

              <div className="row">
                {boardingBookings.map((b) => (
                  <div key={b.id} className="col-md-4 mb-4">
                    <div className="card shadow-sm p-4 text-center">
                      <h4>🐾 {b.petName}</h4>
                      <h4 className="mb-2">🐶 {b.petName}</h4>
                      <p className="text-muted mb-2">
                        📅 {b.startDate} → {b.endDate}
                      </p>

                      <div>
                        {b.status === "pending" && (
                          <span className="badge bg-warning">Pending</span>
                        )}

                        {b.status === "approved" && (
                          <span className="badge bg-success">Approved</span>
                        )}

                        {b.status === "rejected" && (
                          <span className="badge bg-danger">Rejected</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quick Actions */}
          <section className="why__we-are-area-two">
            <div className="container">
              <div className="section__title text-center mb-40">
                <span className="sub-title">Quick Actions</span>
                <h2 className="title">Manage Your Pets</h2>
              </div>

              <div className="row justify-content-center">
                {/* Add Own Pet */}
                <div className="col-lg-4 col-md-6">
                  <div className="why__we-are-item text-center">
                    <div className="why__we-are-item-icon">
                      <img src="/assets/img/icon/why_icon01.svg" alt="" />
                    </div>

                    <div className="why__we-are-item-content">
                      <h4 className="title">Add My Pet</h4>
                      <p>Add your own pet profile.</p>

                      <NavLink to="/add-my-pet" className="btn">
                        Add Pet
                      </NavLink>
                    </div>
                  </div>
                </div>

                {/* Adopt Pet */}
                <div className="col-lg-4 col-md-6">
                  <div className="why__we-are-item text-center">
                    <div className="why__we-are-item-icon">
                      <img src="/assets/img/icon/why_icon03.svg" alt="" />
                    </div>

                    <div className="why__we-are-item-content">
                      <h4 className="title">Adopt a Pet</h4>
                      <p>Browse pets available for adoption.</p>

                      <NavLink to="/allpet" className="btn">
                        Browse Pets
                      </NavLink>
                    </div>
                  </div>
                </div>

                {/* Pet Boarding */}
                <div className="col-lg-4 col-md-6">
                  <div className="why__we-are-item text-center">
                    <div className="why__we-are-item-icon">
                      <img src="/assets/img/icon/why_icon02.svg" alt="" />
                    </div>

                    <div className="why__we-are-item-content">
                      <h4 className="title">Pet Boarding</h4>

                      <p>Book a safe stay for your pet while you're away.</p>

                      <NavLink to="/petboarding" className="btn">
                        Book Boarding
                      </NavLink>
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

  export default Dashboard;
