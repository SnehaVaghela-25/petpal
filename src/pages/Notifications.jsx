import { useUserStore } from "../store/userStore";

import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";

import {
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Notifications() {

  const [requestDetails, setRequestDetails] = useState({});
  const userStore = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userStore?.uid) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userStore.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [userStore?.uid]);


useEffect(() => {
  if (!notifications.length) return;

  const fetchRequests = async () => {
    const details = {};

    for (let n of notifications) {
      if (n.type === "adoption" && n.relatedId) {
        const ref = doc(db, "adoptionRequest", n.relatedId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          details[n.relatedId] = snap.data();
        }
      }

      if (n.type === "service" && n.relatedId) {
        const ref = doc(db, "serviceBookings", n.relatedId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          details[n.relatedId] = snap.data();
        }
      }

      if (n.type === "boarding" && n.relatedId) {
        const ref = doc(db, "boardingBookings", n.relatedId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          details[n.relatedId] = snap.data();
        }
      }
    }

    setRequestDetails(details);
  };

  fetchRequests();
}, [notifications]);

  const markAsRead = async (id) => {
    const ref = doc(db, "notifications", id);
    await updateDoc(ref, { seen: true });
  };

  return (
    <>
      <Navbar />

      <main className="fix">
        {/* PAGE HEADER */}

        <section
          className="banner__area-two"
          style={{ paddingTop: "120px", paddingBottom: "80px" }}
        >
          <div className="container text-center">
            <h2 className="title">Notifications</h2>
            <p>Stay updated with all activities.</p>
          </div>
        </section>

        {/* NOTIFICATION LIST */}

        <section className="container mb-5">
          {notifications.length === 0 ? (
            <p className="text-center">No notifications.</p>
          ) : (
            notifications.map((n) => {
              const badge =
                n.type === "adoption"
                  ? "bg-primary"
                  : n.type === "service"
                    ? "bg-success"
                    : n.type === "boarding" 
                      ? "bg-warning"
                      : n.type === "vaccine"
                        ? "bg-danger"
                        : "bg-secondary";

              const viewLink =
                n.type === "adoption" && n.relatedId
                  ? `/adoption-details/${n.relatedId}`
                  : n.type === "boarding" && n.relatedId
                    ? `/boarding/${n.relatedId}` 
                    : n.link || "#";

              return (
                <div
                  key={n.id}
                  className={`alert ${
                    n.seen ? "alert-light" : "alert-info"
                  } d-flex justify-content-between align-items-start mb-3`}
                >
                  <div>
                    <span className={`badge ${badge} me-2`}>{n.type}</span>

                    <strong>{n.message}</strong>

                    {/* CENTER DETAILS */}
                    {n.type === "adoption" && requestDetails[n.relatedId] && (
                      <p className="mt-2 mb-1"></p>
                    )}

                    {/* SERVICE DETAILS */}
                    {n.type === "service" && requestDetails[n.relatedId] && (
                      <p className="mt-2 mb-1">
                        🐾 <b>{requestDetails[n.relatedId].serviceName}</b>
                        <br />
                        <small className="text-muted">
                          📅 {requestDetails[n.relatedId].date}
                        </small>
                        <br />
                      </p>
                    )}

                    {/* BOARDING DETAILS */}
                    {n.type === "boarding" && requestDetails[n.relatedId] && (
                      <p className="mt-2 mb-1">
                        🐾 <b>{requestDetails[n.relatedId].petName}</b>
                        <br />
                        <small className="text-muted">
                          📅 {requestDetails[n.relatedId].startDate} →{" "}
                          {requestDetails[n.relatedId].endDate}
                        </small>
                      </p>
                    )}
                  </div>

                  {/* RIGHT SIDE ACTIONS */}
                  <div className="d-flex flex-column gap-2 align-items-end">
                    <NavLink
                      to={viewLink}
                      className="btn btn-sm btn-dark"
                      onClick={() => markAsRead(n.id)}
                    >
                      View Details
                    </NavLink>

                    {!n.seen && (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => markAsRead(n.id)}
                      >
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Notifications;
