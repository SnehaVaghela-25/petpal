import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

import { db } from "../firebase/firebase";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";

import { NavLink } from "react-router-dom";

function PetCareTips() {
  const [tips, setTips] = useState([]);

  useEffect(() => {
    const loadTips = async () => {
      const q = query(collection(db, "petTips"), orderBy("createdAt", "desc"));

      const snap = await getDocs(q);

      setTips(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    };

    loadTips();
  }, []);

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title="Pet Care Tips" />

        {/* BLOG AREA */}
        <section className="blog__post-area-four">
          <div className="container">
            {/* SECTION TITLE */}
            <div className="row align-items-center">
              <div className="col-md-8">
                <div className="section__title-two mb-20">
                  <h2 className="title">
                    Pet Care Tips
                    <img
                      src="/assets/img/images/title_shape.svg"
                      alt=""
                      className="injectable"
                    />
                  </h2>
                </div>
              </div>

              {/* <div className="col-md-4">
                <div className="view-all-btn text-md-end">
                  <span>Helpful guides for pet owners</span>
                </div>
              </div> */}
            </div>

            {/* TIPS GRID */}
            <div className="row justify-content-center">
              {tips.length === 0 && (
                <p className="text-center mt-4">No tips available yet.</p>
              )}

              {tips.map((tip) => (
                <div className="col-xl-3 col-lg-4 col-md-6" key={tip.id}>
                  <div className="blog__post-item-four shine-animate-item">
                    {/* IMAGE */}
                    <div className="blog__post-thumb-four shine-animate">
                      <img
                        src={tip.image}
                        alt={tip.title}
                        style={{
                          height: "220px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />

                      {/* CATEGORY */}
                      <ul className="list-wrap blog__post-tag blog__post-tag-three">
                        {/* <li>
                          <span>{tip.category}</span>
                        </li> */}
                      </ul>
                    </div>

                    {/* CONTENT */}
                    <div className="blog__post-content-four">
                      <div className="blog__post-meta">
                        <ul className="list-wrap">
                          <li>
                            <i className="flaticon-user"></i>by Admin
                          </li>
                        </ul>
                      </div>

                      <h2 className="title">
                        <NavLink to={`/pet-tip/${tip.id}`}>{tip.title}</NavLink>
                      </h2>

                      <p style={{ fontSize: "14px" }}>
                        {tip.description?.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SHAPES */}
          <div className="blog__shape-wrap-four">
            <img src="/assets/img/blog/h4_blog_shape01.png" alt="" />
            <img src="/assets/img/blog/h4_blog_shape02.png" alt="" />
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default PetCareTips;
