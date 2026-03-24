import { useUserStore } from "../../store/userStore";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";

export default function MyPets() {
  const user = useUserStore((state) => state.user);

  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setPets([]);
      setLoading(false);
      return;
    }

    async function fetchPets() {
      try {
        const q = query(
          collection(db, "userPets"), 
          where("ownerId", "==", user.uid),
        );

        const snapshot = await getDocs(q);

        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPets(data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPets();
  }, [user]);

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title={"My Pets"} />

        <div className="container mt-4">
          <Link to="/add-my-pet" className="btn mb-4">
            Add My Pet
          </Link>

          <div className="row">
            {loading ? (
              <p>Loading pets...</p>
            ) : pets.length === 0 ? (
              <p>No pets added yet.</p>
            ) : (
              pets.map((pet) => (
                <div className="col-md-4" key={pet.id}>
                  <div className="card p-3 mb-3 shadow-sm">
                    {/* <img
                      src={
                        pet.type?.toLowerCase() === "dog"
                          ? "/assets/img/pets/dog.png"
                          : pet.type?.toLowerCase() === "cat"
                            ? "/assets/img/pets/cat.png"
                            : "/assets/img/pet_placeholder.png"
                      }
                      width="60"
                    /> */}
                    <img
                      src={
                        pet.image
                          ? pet.image
                          : pet.categoryName?.toLowerCase() === "dog"
                            ? "/assets/img/pets/dog.png"
                            : pet.categoryName?.toLowerCase() === "cat"
                              ? "/assets/img/pets/cat.png"
                              : "/assets/img/pet_placeholder.png"
                      }
                      alt={pet.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                    <h4>{pet.name}</h4>

                    <p>Type: {pet.categoryName}</p>

                    <p>Breed: {pet.breed}</p>

                    <p>Age: {pet.age}</p>

                    <Link
                      to={`/pet-health/${pet.id}`}
                      className="btn btn-primary"
                    >
                      View Health
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
