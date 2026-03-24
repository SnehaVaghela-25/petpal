import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { NavLink } from "react-router-dom";

function FeaturedPets() {
  const [pets, setPets] = useState([]);

  // useEffect(() => {
  //   const fetchPets = async () => {
  //     const petsCollection = collection(db, "pets");
  //     const petsSnapshot = await getDocs(petsCollection);
  //     const petsList = petsSnapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setPets(petsList.slice(0, 4));
  //   };
  //   fetchPets();
  // }, []);
useEffect(() => {
  const fetchPets = async () => {
    const q = query(collection(db, "pets"), where("status", "==", "available"));

    const snapshot = await getDocs(q);

    const petsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPets(petsList.slice(0, 4));
  };

  fetchPets();
}, []);
  return (
    <section
      className="animal__area animal__bg py-10"
      style={{
        backgroundImage: 'url("/assets/img/bg/shop_bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="row align-items-center mb-6">
          <div className="col-lg-6">
            <div className="section__title white-title mb-40">
              <span className="sub-title">POPULAR BREEDS</span>
              <h2 className="title">
                Our most popular <br />
                pets for adoption
              </h2>
            </div>
          </div>
          <div className="col-lg-6 text-end">
            <NavLink to="/allpet" className="btn">
              See More pets{" "}
              <img
                src="/assets/img/icon/right_arrow.svg"
                alt="arrow"
                className="injectable"
              />
            </NavLink>
          </div>
        </div>

        {/* Pet Grid */}
        <div className="row justify-content-center">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="col-xl-3 col-lg-4 col-md-6 col-sm-10 mb-6"
            >
              <div className="animal__item shine-animate-item bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="animal__thumb shine-animate relative overflow-hidden rounded-t-lg">
                  <NavLink to={`/petdetails/${pet.id}`}>
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-60 object-cover"
                    />
                  </NavLink>
                  <NavLink to={`/petdetails/${pet.id}`}></NavLink>
                </div>

                <div className="animal__content p-4">
                  <span className="animal-code text-gray-400 text-sm">
                    ID: {pet.id.slice(0, 6).toUpperCase()}
                  </span>
                  <h4 className="title mt-1 font-bold text-lg">
                    <NavLink to={`/petdetails/${pet.id}`}>{pet.name}</NavLink>
                  </h4>
                  {pet.price && (
                    <h4 className="price mt-2 text-green-600 font-semibold">
                      ₹{pet.price}
                    </h4>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedPets;
