import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  limit,
} from "firebase/firestore";import { db } from "../firebase/firebase";
import { NavLink } from "react-router-dom";

function RecentlyAdoptedPets() {
  const [pets, setPets] = useState([]);

  // useEffect(() => {
  //   const fetchAdoptedPets = async () => {
  //     try {
  //       const q = query(
  //         collection(db, "pets"),
  //         where("status", "==", "adopted"),
  //         limit(3),
  //       );

  //       const snapshot = await getDocs(q);

  //       const list = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));

  //       setPets(list);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchAdoptedPets();
  // }, []);
useEffect(() => {
  const q = query(
    collection(db, "pets"),
    where("status", "==", "adopted"),
    limit(3),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setPets(list);
  });

  return () => unsubscribe();
}, []);
  return (
    <section className="blog__post-area section-py-120">
      <div className="container">
        {/* SECTION HEADER */}
        <div className="row align-items-center">
          <div className="col-md-8">
            <div className="section__title mb-40">
              <span className="sub-title">
                Happy Endings
                <strong className="shake">
                  <img
                    src="/assets/img/icon/pet_icon02.svg"
                    alt=""
                    className="injectable"
                  />
                </strong>
              </span>
              <h2 className="title">Recently Adopted Pets</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="view__all-btn text-end mb-40">
              <NavLink to="/allpet" className="btn btn-two">
                View Available Pets
                <img
                  src="/assets/img/icon/right_arrow.svg"
                  alt=""
                  className="injectable"
                />
              </NavLink>
            </div>
          </div>
        </div>

        {/* PET CARDS */}
        <div className="row justify-content-center">
          {pets.length === 0 ? (
            <p className="text-center">No adopted pets yet.</p>
          ) : (
            pets.map((pet) => (
              <div className="col-lg-4 col-md-6 col-sm-8" key={pet.id}>
                <div className="blog__post-item shine-animate-item">
                  {/* IMAGE */}
                  <div className="blog__post-thumb">
                    <div className="blog__post-mask shine-animate">
                      <img
                        src={pet.image}
                        alt={pet.name}
                        style={{
                          height: "240px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />

                      {/* TAGS */}
                      <ul className="list-wrap blog__post-tag">
                        <li>
                          <a href="#">{pet.categoryName}</a>
                        </li>
                        <li>
                          <a href="#">Adopted ❤️</a>
                        </li>
                      </ul>
                    </div>

                    <div className="shape">
                      <img
                        src="/assets/img/blog/blog_img_shape.svg"
                        alt=""
                        className="injectable"
                      />
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="blog__post-content">
                    <div className="blog__post-meta">
                      <ul className="list-wrap">
                        <li>
                          <i className="flaticon-user"></i>
                          Adopted by Family
                        </li>

                        <li>
                          <i className="flaticon-calendar"></i>
                          Happy Home
                        </li>
                      </ul>
                    </div>

                    <h2 className="title">
                      <NavLink to={`/pet/${pet.id}`}>
                        {pet.name} ({pet.breed})
                      </NavLink>
                    </h2>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default RecentlyAdoptedPets;
