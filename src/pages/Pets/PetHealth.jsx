
  import { onAuthStateChanged } from "firebase/auth";
  import { auth } from "../../firebase/firebase";

  import { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp,
  } from "firebase/firestore";
  import { db } from "../../firebase/firebase";
  import Navbar from "../../components/Navbar";
  import Footer from "../../components/Footer";
  import PageTitle from "../../components/PageTitle";

  export default function PetHealth() {
    const { petId } = useParams();

    const [pet, setPet] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [records, setRecords ] = useState([]);
    const [recordType, setRecordType] = useState("vaccination");
    const [vaccineName, setVaccineName] = useState("");
    const [givenDate, setGivenDate] = useState("");

    const [activeTab, setActiveTab] = useState("vaccination");

    // ================= STATUS =================
    function getVaccineStatus(date) {
      if (!date) return { label: "Unknown", className: "bg-secondary" };

      const dueDate = date?.seconds
        ? new Date(date.seconds * 1000)
        : new Date(date);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

      if (diff < 0) return { label: `❌ Overdue`, className: "bg-danger" };

      if (diff <= 7) return { label: `⚠ Due Soon`, className: "bg-warning" };

      return { label: "✅ Safe", className: "bg-success" };
    }


    async function checkAndSendReminders(records, userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let rec of records) {
        if (!rec.nextDueDate) continue;

        const dueDate = rec.nextDueDate.seconds
          ? new Date(rec.nextDueDate.seconds * 1000)
          : new Date(rec.nextDueDate);

        const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

        let message = null;

        if (diff === 7) {
          message = `⚠ Vaccine ${rec.vaccineName} due in 7 days`;
        } else if (diff === 3) {
          message = `⏰ Vaccine ${rec.vaccineName} due in 3 days`;
        } else if (diff < 0) {
          message = `❌ Vaccine ${rec.vaccineName} is overdue`;
        }

        if (message) {
          const existingQuery = query(
          collection(db, "notifications"),
          where("relatedId", "==", rec.id),
          where("type", "==", "vaccine")
        );

        const existingSnap = await getDocs(existingQuery);

        if (!existingSnap.empty) continue;
          await addDoc(collection(db, "notifications"), {
            userId,
            type: "vaccine",
            message,
            link: `/pet-health/${rec.petId}`,
            relatedId: rec.id,
            seen: false,
            createdAt: serverTimestamp(),
          });
        }
      }
    }

    // ================= FETCH =================
    async function fetchRecords(user) {
      if (!petId) return;

      const q = query(
        collection(db, "petHealthRecords"),
        where("petId", "==", petId),
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // sort by next due date
      data.sort((a, b) => {
        const d1 = a.nextDueDate?.seconds
          ? new Date(a.nextDueDate.seconds * 1000)
          : new Date(a.nextDueDate);

        const d2 = b.nextDueDate?.seconds
          ? new Date(b.nextDueDate.seconds * 1000)
          : new Date(b.nextDueDate);

        return d1 - d2;
      });

      setRecords(data);

      // ✅ ADD THIS LINE
      await checkAndSendReminders(data, user.uid);
    }


    async function fetchPet() {
      if (!petId) return;

      const snap = await getDocs(
        query(collection(db, "pets"), where("__name__", "==", petId)),
      );

      snap.forEach((doc) => {
        setPet({ id: doc.id, ...doc.data() });
      });
    }


    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (user) => {
        if (!user) {
          setRecords([]);
          return;
        }
        fetchRecords(user);
        fetchPet();
      });

      return () => unsub();
    }, [petId]);

    // ================= CALCULATE =================
    function calculateNextDueDate(vaccine, date) {
      const d = new Date(date);
      d.setFullYear(d.getFullYear() + 1);
      return d;
    }

    // ================= ADD =================
    async function addRecord(e) {
      e.preventDefault();

      if (!recordType || !givenDate) {
        alert("Fill all fields");
        return;
      }

      await addDoc(collection(db, "petHealthRecords"), {
        petId,
        // vaccineName,
        vaccineName: recordType === "vaccination" ? vaccineName : recordType,
        // type: "vaccination",
        type: recordType,
        givenDate: new Date(givenDate),
        nextDueDate: calculateNextDueDate(vaccineName, givenDate),
        createdAt: serverTimestamp(),
      });
      
      await addDoc(collection(db, "notifications"), {
        userId: userId,
        type: "vaccine",
        message: `⚠ Vaccine ${rec.vaccineName} due in 3 days`,
        link: `/pet-health/${rec.petId}`,
        relatedId: rec.id,
        seen: false,
        createdAt: serverTimestamp(),
      });
      setVaccineName("");
      setGivenDate("");
      setShowForm(false);
      // fetchRecords();
      fetchRecords({ uid: auth.currentUser.uid });
    }

    // ================= UI =================
    return (
      <>
        <Navbar />

        <main className="fix">
          <PageTitle title="Your Pet’s Health Records" />

          <div className="container">
            {/* ================= PET PROFILE ================= */}
            {pet && (
              <div className="card mb-4 p-4 shadow-sm rounded-4">
                <div className="d-flex align-items-center gap-4">
                  <img
                    src={pet.image || "/assets/images/no-image.png"}
                    alt={pet.name}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "3px solid #eee",
                    }}
                  />

                  <div>
                    <h3 className="mb-1">{pet.name}</h3>

                    <div className="text-muted mb-2">
                      {pet.breed} • {pet.categoryName}
                    </div>

                    <div className="d-flex gap-3">
                      <span className="badge bg-light text-dark px-3 py-2">
                        Age: {pet.age} yrs
                      </span>

                      <span className="badge bg-light text-dark px-3 py-2">
                        Weight: {pet.weight || "N/A"} kg
                      </span>

                      <span
                        className={` badge px-3 py-2 ${
                          pet.status === "adopted" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {pet.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TABS ================= */}
            <div className="d-flex gap-3 mb-4">
              {["vaccination", "deworming", "vet"].map((tab) => (
                <button
                  key={tab}
                  className={`btn ${
                    activeTab === tab ? "btn-theme" : "btn-light"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ================= ADD BUTTON ================= */}
            <div className="mb-3">
              <button
                className="btn btn-theme"
                onClick={() => setShowForm(true)}
              >
                + Add Record
              </button>
            </div>

            {/* ================= FORM ================= */}
            {showForm && (
              <form onSubmit={addRecord} className="card p-3 mb-4">

                {recordType === "vaccination" && (
                  <select
                    value={vaccineName}
                    onChange={(e) => setVaccineName(e.target.value)}
                    className="form-control mb-2"
                  >
                    <option value="">Select Vaccine</option>
                    <option>DHPP</option>
                    <option>Rabies</option>
                    <option>FVRCP</option>
                    <option>FeLV</option>
                  </select>
                )}
                <input
                  type="date"
                  value={givenDate}
                  onChange={(e) => setGivenDate(e.target.value)}
                  className="form-control mb-2"
                />

                <button className="btn btn-theme">Save</button>
              </form>
            )}

            {/* ================= CARDS ================= */}
            {/* <div className="row">
              {records
                .filter((r) => r.type === activeTab)
                .map((rec) => {
                  const status = getVaccineStatus(rec.nextDueDate);

                  return (
                    <div className="col-md-6 mb-4" key={rec.id}>
                      <div className="card p-4 shadow-sm rounded-4">
                        <div className="d-flex justify-content-between">
                          <h5>{rec.vaccineName}</h5>
                          <span className={`badge ${status.className}`}>
                            {status.label}
                          </span>
                        </div>

                        <p className="text-muted">
                          Given:{" "}
                          {rec.givenDate
                            ? new Date(
                                rec.givenDate.seconds * 1000,
                              ).toDateString()
                            : "-"}
                        </p>

                        <p className="text-muted">
                          Next:{" "}
                          {rec.nextDueDate
                            ? new Date(
                                rec.nextDueDate.seconds * 1000,
                              ).toDateString()
                            : "-"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div> */}
            <div className="row">
              {records
                .filter((r) => r.type === activeTab)
                .map((rec) => {
                  const status = getVaccineStatus(rec.nextDueDate);

                  return (
                    <div className="col-md-6 mb-4" key={rec.id}>
                      <div
                        className="p-4 rounded-4 shadow-sm"
                        style={{
                          background: "#fff",
                          borderLeft: `6px solid ${
                            status.className === "bg-danger"
                              ? "#ff4d4f"
                              : status.className === "bg-warning"
                                ? "#faad14"
                                : "#52c41a"
                          }`,
                        }}
                      >
                        {/* HEADER */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h5 style={{ fontWeight: "600" }}>
                            💉 {rec.vaccineName}
                          </h5>

                          <span
                            className="px-3 py-1 rounded-pill"
                            style={{
                              background:
                                status.className === "bg-danger"
                                  ? "#ffe5e5"
                                  : status.className === "bg-warning"
                                    ? "#fff7e6"
                                    : "#eaffea",
                              color:
                                status.className === "bg-danger"
                                  ? "#d32f2f"
                                  : status.className === "bg-warning"
                                    ? "#d48806"
                                    : "#2e7d32",
                              fontSize: "12px",
                            }}
                          >
                            {status.label}
                          </span>
                        </div>

                        {/* DATES */}
                        <p className="text-muted mb-1">
                          🗓 Given:{" "}
                          {rec.givenDate
                            ? new Date(
                                rec.givenDate.seconds * 1000,
                              ).toDateString()
                            : "N/A"}
                        </p>

                        <p className="text-muted mb-0">
                          ⏭ Next Due:{" "}
                          {rec.nextDueDate
                            ? new Date(
                                rec.nextDueDate.seconds * 1000,
                              ).toDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }