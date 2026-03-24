import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";
import PetCard from "../../components/PetCard";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

function AllPets() {
  
  const capitalize = (val) => {
    if (!val || typeof val !== "string") return "Unknown";
    return val.charAt(0).toUpperCase() + val.slice(1);
  };

  const navigate = useNavigate();

  const [pets, setPets] = useState([]);
  const [priceRange, setPriceRange] = useState(5000);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("All");
  const [selectedGender, setSelectedGender] = useState("All");
  const [selectedBreed, setSelectedBreed] = useState("All");
  const [breedOptions, setBreedOptions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [locationOptions, setLocationOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];


useEffect(() => {
  const unsubPets = getPets();
  return () => unsubPets();
}, [category, selectedGender, selectedBreed, selectedLocation, searchTerm]);

useEffect(() => {
  const unsubCategory = getCategory();
  const unsubBreeds = getAllBreeds();
  const unsubLocation = getAllLocation();

  return () => {
    unsubCategory();
    unsubBreeds();
    unsubLocation();
  };
}, [category]);

function getPets() {
  const petRef = collection(db, "pets");

  return onSnapshot(petRef, (snapshot) => {
    let result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    result = result.filter((pet) => pet.status === "available");

    if (category !== "All") {
      result = result.filter((pet) => pet.categoryName === category);
    }

    if (selectedGender !== "All") {
      result = result.filter((pet) => pet.gender === selectedGender);
    }

    if (selectedBreed !== "All") {
      result = result.filter((pet) => pet.breed === selectedBreed);
    }

    if (selectedLocation !== "All") {
      result = result.filter((pet) => pet.location === selectedLocation);
    }

    if (searchTerm) {
      result = result.filter((pet) =>
        pet.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setPets(result);
  });
}

  function getAllBreeds() {
    let petRef = collection(db, "pets");

    let conditions = [where("status", "==", "available")];

    if (category !== "All") {
      conditions.push(where("categoryName", "==", category));
    }

    const q = query(petRef, ...conditions);

    return onSnapshot(q, (snapshot) => {
      const allPets = snapshot.docs.map((doc) => doc.data());

      const uniqueBreeds = [...new Set(allPets.map((pet) => pet.breed))];

      setBreedOptions(uniqueBreeds);
    });
  }
 
 function getAllLocation() {
   const petRef = query(
     collection(db, "pets"),
     where("status", "==", "available"),
   );

   return onSnapshot(petRef, (snapshot) => {
     const allPets = snapshot.docs.map((doc) => doc.data());

     const uniqueLocations = [
       ...new Set(
         allPets
           .map((pet) => pet.location?.trim())
           .filter(Boolean),
       ),
     ];

     setLocationOptions(uniqueLocations);
   });
 }


  
  function getCategory() {
    const catRef = collection(db, "categories");

    return onSnapshot(catRef, (snapshot) => {
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(result);
    });
  }

  return (
    <>
      {/* header-area */}
      <Navbar />
      {/* header-area-end */}
      {/* main-area */}
      <main>
        {/* breadcrumb-area */}
        <PageTitle title="Adopt Pet" />
        {/* breadcrumb-area-end */}
        {/* animal-area */}
        <section className="animal__area-three">
          <div className="container">
            <div className="row">
              <div className="col-xl-9 col-lg-8 order-0 order-lg-2">
                {/* <div className="row">
                  {pets.map((pet) => (
                    <div className="col-xl-4 col-md-6" key={pet.id}>
                    
                      <div className="animal__item animal__item-two animal__item-three shine-animate-item">
                        <div className="animal__thumb animal__thumb-two shine-animate">
                          {pet.image && 
                          <img src={pet.image} alt={pet.name} />
                          }
                          <img
                            src={
                              pet.image
                                ? pet.image
                                : pet.categoryName?.toLowerCase() === "dog"
                                  ? "/assets/img/pets/dog.png"
                                  : pet.categoryName?.toLowerCase() === "cat"
                                    ? "/assets/img/pets/cat.png"
                                    : pet.categoryName?.toLowerCase() ===
                                        "rabbit"
                                      ? "/assets/img/pets/rabbit.png"
                                      : "/assets/img/pet_placeholder.png"
                            }
                            alt={pet.name}
                          />
                        </div>

                        <div className="animal__content animal__content-two">
                          <h4 className="title">{pet.name}</h4>

                          <div className="pet-info">
                            <ul className="list-wrap">
                              <li>
                                Gender: <span>{pet.gender}</span>
                              </li>
                              <li>
                                Breed: <span>{pet.breed}</span>
                              </li>
                            </ul>
                          </div>

                          <div className="location">
                            <i className="flaticon-placeholder" />
                            <span>{pet.location}</span>
                          </div>

                          <button
                            className="btn mt-2"
                            onClick={() => navigate(`/petdetails/${pet.id}`)}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pets.length === 0 && (
                    <div className="text-center mt-5">
                      <h4>No pets available right now</h4>
                    </div>
                  )}
                </div> */}

                <div className="row">
                  {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}

                  {pets.length === 0 && (
                    <div className="text-center mt-5">
                      <h4>No pets available right now</h4>
                    </div>
                  )}
                </div>

              </div>
              <div className="col-xl-3 col-lg-4">
                <aside className="animal__sidebar">
                  <div className="animal__widget">
                    <h4 className="animal__widget-title">Filters</h4>
                    <div className="sidebar-search-form">
                      <form action="#">
                        <input
                          type="text"
                          placeholder="Search pet..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">
                          <i className="flaticon-loupe" />
                        </button>
                      </form>
                    </div>
                  </div>
                  {/* <div className="animal__widget">
                      <h4 className="animal__widget-title">Price</h4>

                      <div className="price_filter">
                        <input
                          type="range"
                          min="0"
                          max="50000"
                          value={priceRange}
                          onChange={(e) => setPriceRange(Number(e.target.value))}
                          style={{ width: "100%" }}
                        />

                        <div className="price_slider_amount">
                          <input
                            type="text"
                            readOnly
                            value={`Up to ₹ ${priceRange}`}
                          />
                        </div>
                      </div>
                    </div> */}
                  <div className="animal__widget">
                    <h4 className="animal__widget-title">Pet Categories</h4>
                    <div className="courses-cat-list">
                      <ul className="list-wrap">
                        <li>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="category"
                              style={{ borderRadius: "50%" }}
                              id="all"
                              value="All"
                              checked={category === "All"}
                              onChange={(e) => setCategory(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="all">
                              All Categories
                            </label>
                          </div>
                        </li>
                        {categories &&
                          categories.map(function (pet) {
                            return (
                              <li key={pet.id}>
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    id={pet.id}
                                    name="category"
                                    style={{ borderRadius: "50%" }}
                                    value={pet.name.toLowerCase()}
                                    checked={
                                      category === pet.name.toLowerCase()
                                    }
                                    onChange={(e) =>
                                      setCategory(e.target.value)
                                    }
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={pet.id}
                                  >
                                    {pet.name}
                                  </label>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                  <div className="animal__widget">
                    <h4 className="animal__widget-title">Breeds</h4>
                    <div className="courses-cat-list">
                      <ul className="list-wrap">
                        {/* All */}
                        <li>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="breed"
                              value="All"
                              style={{ borderRadius: "50%" }}
                              checked={selectedBreed === "All"}
                              onChange={(e) => setSelectedBreed(e.target.value)}
                            />
                            <label className="form-check-label">All</label>
                          </div>
                        </li>

                        {/* Dynamic Breed */}
                        {breedOptions.map((breed, i) => (
                          <li key={breed || i}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="breed"
                                value={breed || ""}
                                style={{ borderRadius: "50%" }}
                                checked={selectedBreed === breed}
                                onChange={(e) =>
                                  setSelectedBreed(e.target.value)
                                }
                              />
                              <label className="form-check-label">
                                {capitalize(breed)}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="animal__widget">
                    <h4 className="animal__widget-title">Gender</h4>
                    <div className="courses-cat-list">
                      <ul className="list-wrap">
                        {/* All Option */}
                        {/* All */}
                        <li>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="gender"
                              style={{ borderRadius: "50%" }}
                              value="All"
                              checked={selectedGender === "All"}
                              onChange={(e) =>
                                setSelectedGender(e.target.value)
                              }
                            />
                            <label className="form-check-label">All</label>
                          </div>
                        </li>

                        {/* Male / Female */}
                        {genderOptions.map((g) => (
                          <li key={g.value}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="gender"
                                style={{ borderRadius: "50%" }}
                                value={g.value}
                                checked={selectedGender === g.value}
                                onChange={(e) =>
                                  setSelectedGender(e.target.value)
                                }
                              />
                              <label className="form-check-label">
                                {g.label}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="animal__widget">
                    <h4 className="animal__widget-title">Location</h4>
                    <div className="courses-cat-list">
                      <ul className="list-wrap">
                        {/* All */}
                        <li>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              style={{ borderRadius: "50%" }}
                              name="location"
                              value="All"
                              checked={selectedLocation === "All"}
                              onChange={(e) =>
                                setSelectedLocation(e.target.value)
                              }
                            />
                            <label className="form-check-label">All</label>
                          </div>
                        </li>

                        {/* Dynamic Locations */}
                        {locationOptions.map((loc) => (
                          <li key={loc}>
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="location"
                                style={{ borderRadius: "50%" }}
                                value={loc}
                                checked={selectedLocation === loc}
                                onChange={(e) =>
                                  setSelectedLocation(e.target.value)
                                }
                              />
                              <label className="form-check-label">
                                {capitalize(loc)}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </aside>
              </div>
            </div>
            <button
              className="btn btn-sm mt-3"
              onClick={() => {
                setCategory("All");
                setSelectedBreed("All");
                setSelectedGender("All");
                setSelectedLocation("All");
                setPriceRange(5000);
                setSearchTerm("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </section>
        {/* animal-area-end */}
      </main>
      {/* main-area-end */}
      {/* footer-area */}
      <Footer />
      {/* footer-area-end */}
    </>
  );
}
export default AllPets;
