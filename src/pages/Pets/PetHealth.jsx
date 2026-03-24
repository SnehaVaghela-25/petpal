// // import { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
// // import { db } from "../firebase";

// // export default function PetHealth() {
// //   const { petId } = useParams();
// //   const [vaccines, setVaccines] = useState([]);

// //   useEffect(() => {
// //     async function fetchVaccines() {
// //       const q = query(
// //         collection(db, "petHealthRecords"),
// //         where("petId", "==", petId),
// //       );
// //       const snapshot = await getDocs(q);
// //       const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
// //       setVaccines(data);
// //     }

// //     fetchVaccines();
// //   }, [petId]);

// //   return (
// //     <div>
// //       <h2>Pet Health & Vaccination</h2>
// //       {vaccines.length === 0 ? (
// //         <p>No vaccination records yet.</p>
// //       ) : (
// //         vaccines.map((vac) => (
// //           <div
// //             key={vac.id}
// //             style={{
// //               margin: "10px 0",
// //               border: "1px solid #ccc",
// //               padding: "10px",
// //             }}
// //           >
// //             <p>Vaccine: {vac.vaccineName}</p>
// //             <p>Next Due Date: {vac.nextDueDate.toDate().toDateString()}</p>
// //             <p>Status: {vac.completed ? "Completed" : "Pending"}</p>
// //           </div>
// //         ))
// //       )}
// //     </div>
// //   );
// // }

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../../firebase/firebase";

// export default function PetHealth() {
//   const { petId } = useParams();

//   const [vaccines, setVaccines] = useState([]);

//   const [vaccineName, setVaccineName] = useState("");
//   const [nextDate, setNextDate] = useState("");

//   async function fetchVaccines() {
//     const q = query(
//       collection(db, "petHealthRecords"),
//       where("petId", "==", petId),
//     );

//     const snapshot = await getDocs(q);

//     const data = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     setVaccines(data);
//   }

//   useEffect(() => {
//     fetchVaccines();
//   }, [petId]);

//   async function addVaccine(e) {
//     e.preventDefault();

//     try {
//       await addDoc(collection(db, "petHealthRecords"), {
//         petId: petId,
//         vaccineName: vaccineName,
//         nextDueDate: new Date(nextDate),
//         completed: false,
//         createdAt: serverTimestamp(),
//       });

//       setVaccineName("");
//       setNextDate("");

//       fetchVaccines();
//     } catch (error) {
//       console.error("Error adding vaccine:", error);
//     }
//   }

//   return (
//     <div className="container mt-4">
//       <h2 className="mb-4">Pet Health & Vaccination</h2>

//       {/* Add Vaccine Form */}

//       <div className="card p-3 mb-4">
//         <h5>Add Vaccination</h5>

//         <form onSubmit={addVaccine}>
//           <div className="row">
//             <div className="col-md-5">
//               <input
//                 type="text"
//                 className="form-control"
//                 placeholder="Vaccine Name"
//                 value={vaccineName}
//                 onChange={(e) => setVaccineName(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="col-md-4">
//               <input
//                 type="date"
//                 className="form-control"
//                 value={nextDate}
//                 onChange={(e) => setNextDate(e.target.value)}
//                 required
//               />
//             </div>

//             <div className="col-md-3">
//               <button className="btn btn-primary w-100">Add Record</button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {/* Vaccination Records */}

//       {vaccines.length === 0 ? (
//         <p>No vaccination records yet.</p>
//       ) : (
//         <div className="row">
//           {vaccines.map((vac) => (
//             <div className="col-md-4" key={vac.id}>
//               <div className="card mb-3 shadow-sm">
//                 <div className="card-body">
//                   <h5>{vac.vaccineName}</h5>

//                   <p>
//                     Next Due Date:{" "}
//                     {vac.nextDueDate
//                       ? new Date(vac.nextDueDate.seconds * 1000).toDateString()
//                       : "Not set"}
//                   </p>

//                   <span
//                     className={`badge ${
//                       vac.completed ? "bg-success" : "bg-warning"
//                     }`}
//                   >
//                     {vac.completed ? "Completed" : "Pending"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

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


const [showForm, setShowForm] = useState(false);

  const [vaccines, setVaccines] = useState([]);
  const [vaccineName, setVaccineName] = useState("");
  const [nextDate, setNextDate] = useState("");
  
  function getVaccineStatus(date) {
    if (!date) return { label: "Unknown", className: "bg-secondary" };

    const dueDate = date?.seconds
      ? new Date(date.seconds * 1000)
      : new Date(date);

    const today = new Date();

    const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      return {
        label: `❌ Overdue by ${Math.abs(diff)} days`,
        className: "bg-danger",
      };
    }

    if (diff <= 7) {
      return {
        label: `⚠ Due in ${diff} days`,
        className: "bg-warning",
      };
    }

    return {
      label: "Upcoming",
      className: "bg-success",
    };
  }


// async function fetchVaccines() {
//   if (!petId) return;

//   const q = query(
//     collection(db, "petHealthRecords"),
//     where("petId", "==", petId),
//   );

//   const snapshot = await getDocs(q);

//   const data = snapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));

//   // sort newest first
//   data.sort((a, b) => {
//     const dateA = a.nextDueDate?.seconds
//       ? new Date(a.nextDueDate.seconds * 1000)
//       : new Date(a.nextDueDate);

//     const dateB = b.nextDueDate?.seconds
//       ? new Date(b.nextDueDate.seconds * 1000)
//       : new Date(b.nextDueDate);

//     return dateA - dateB;
//   });

//   setVaccines(data);
// }


async function fetchVaccines() {
  if (!petId) return;

  const q = query(
    collection(db, "petHealthRecords"),
    where("petId", "==", petId),
  );

  const snapshot = await getDocs(q);

  const records = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  setVaccines(records);
}


 useEffect(() => {
   const unsubscribe = onAuthStateChanged(auth, (user) => {
     if (!user) {
       setVaccines([]);
       return;
     }

     fetchVaccines();
   });

   return () => unsubscribe();
 }, [petId]);



function calculateNextDueDate(vaccine, givenDate) {
  const date = new Date(givenDate);

  if (vaccine === "Rabies") {
    date.setFullYear(date.getFullYear() + 1);
  } else if (vaccine === "FVRCP") {
    date.setFullYear(date.getFullYear() + 1);
  } else if (vaccine === "FeLV") {
    date.setFullYear(date.getFullYear() + 1);
  }

  return date;
}


  async function addVaccine(e) {
    e.preventDefault();

     if (!vaccineName || !nextDate) {
       alert("Please fill all fields");
       return;
     }
  const nextDue = calculateNextDueDate(vaccineName, nextDate);

     await addDoc(collection(db, "petHealthRecords"), {
       petId,
       vaccineName,
       givenDate: new Date(nextDate),
       nextDueDate: nextDue,
       createdAt: serverTimestamp(),
     });

    setVaccineName("");
    setNextDate("");

    fetchVaccines();

    setShowForm(false);
  
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title={"Pet Health & Vaccination"} />

        <section className="registration__area-two">
          <div className="container">
            <div className="registration__inner-wrap-two">

              <div className="row">

                {showForm && (
                  <div className="col-lg-6">
                    <div className="registration__form-wrap">
                      <form
                        className="registration__form"
                        onSubmit={addVaccine}
                      >
                        <h3 className="title">Add Vaccination</h3>

                        <div className="row gutter-20">
                          <div className="col-md-12">
                            <div className="form-grp">
                              <select
                                value={vaccineName}
                                onChange={(e) => setVaccineName(e.target.value)}
                                required
                              >
                                <option value="">Select Vaccine</option>
                                <option value="Rabies">Rabies</option>
                                <option value="FVRCP">FVRCP</option>
                                <option value="FeLV">FeLV</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-grp">
                              <input
                                type="date"
                                value={nextDate}
                                onChange={(e) => setNextDate(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <button className="btn me-2">Add Vaccine</button>

                        <button
                          type="button"
                          className="btn btn-light"
                          onClick={() => setShowForm(false)}
                        >
                          Cancel
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                <div className="col-lg-6">
                  <h4 className="mb-3">Pet Health Timeline</h4>

                  <div className="card p-3 mb-4">
                    <ul className="list-unstyled mb-0">
                      <li>💉 Vaccination Records</li>
                      <li className="text-muted">🪱 Deworming (Coming Soon)</li>
                      <li className="text-muted">
                        🩺 Vet Visits (Coming Soon)
                      </li>
                    </ul>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">Vaccination Records</h4>

                    {!showForm && (
                      <button
                        className="btn btn-sm btn-theme"
                        onClick={() => setShowForm(true)}
                      >
                        + Add Vaccine
                      </button>
                    )}
                  </div>

                  {vaccines.length === 0 ? (
                    <div className="alert alert-info">
                      No vaccination records yet. Add your pet's first vaccine.
                    </div>
                  ) : (
                    vaccines.map((vac) => {
                      const status = getVaccineStatus(vac.nextDueDate);

                      return (
                        <div
                          key={vac.id}
                          className="card border-0 shadow-sm p-3 mb-3"
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">{vac.vaccineName}</h6>

                            <span className={`badge ${status.className}`}>
                              {status.label}
                            </span>
                          </div>

                          <p className="mb-0 mt-2 text-muted">
                            Next Due Date:{" "}
                            {vac.nextDueDate
                              ? new Date(
                                  vac.nextDueDate?.seconds
                                    ? vac.nextDueDate.seconds * 1000
                                    : vac.nextDueDate,
                                ).toDateString()
                              : "Not set"}
                          </p>
                        </div>
                      );
                    })
                  )}
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