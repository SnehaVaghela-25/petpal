import { useUserStore } from "../../store/userStore";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";

function AddMyPet() {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");

  async function handleAddPet(e) {
    e.preventDefault();

    if (loading) return;

    if (!user || !user.uid) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!name || !category || !breed || !age) {
      alert("Please fill all fields");
      return;
    }

    const normalizedCategory = category.trim().toLowerCase();

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "userPets"), {
        ownerId: user.uid,
        name,
        category: normalizedCategory,
        breed,
        age: Number(age),
        createdAt: serverTimestamp(),
      });

      await createDefaultVaccines(docRef.id, normalizedCategory);

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard"); 
      }, 1500);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function createDefaultVaccines(petId, petType) {
    let vaccines = [];

    if (petType === "dog") {
      vaccines = [
        { name: "DHPP", weeks: 6 },
        { name: "Parvo", weeks: 8 },
        { name: "Rabies", weeks: 12 },
        { name: "Booster", weeks: 52 },
      ];
    }

    if (petType === "cat") {
      vaccines = [
        { name: "FVRCP", weeks: 8 },
        { name: "Rabies", weeks: 12 },
        { name: "Booster", weeks: 52 },
      ];
    }

    for (const vac of vaccines) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + vac.weeks * 7);

      await addDoc(collection(db, "petHealthRecords"), {
        petId,
        vaccineName: vac.name,
        nextDueDate: dueDate,
        completed: false,
        createdAt: serverTimestamp(),
      });
    }
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title={"Add My Pet"} />

        <section className="registration__area-two">
          <div className="container">
            <div className="registration__inner-wrap-two">
              <div className="row">
                <div className="col-lg-8">
                  <div className="registration__form-wrap">
                    {success && (
                      <div className="alert alert-success">
                        🐾 Pet added successfully! Redirecting...
                      </div>
                    )}

                    <form
                      className="registration__form"
                      onSubmit={handleAddPet}
                    >
                      <h3 className="title">Add Your Pet</h3>

                      <div className="row gutter-20">
                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              type="text"
                              placeholder="Pet Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              type="text"
                              placeholder="Pet Type (Dog, Cat)"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              type="text"
                              placeholder="Breed"
                              value={breed}
                              onChange={(e) => setBreed(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              type="number"
                              placeholder="Age"
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              min={1}
                              max={30}
                            />
                          </div>
                        </div>
                      </div>

                      <button className="btn" disabled={loading}>
                        {loading ? "Adding..." : "Add Pet"}
                        <img
                          src="/assets/img/icon/right_arrow.svg"
                          alt=""
                          className="injectable"
                        />
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="registration__img">
                    <img src="/assets/img/images/registration_img.png" alt="" />
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

export default AddMyPet;
