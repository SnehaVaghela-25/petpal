// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { doc, getDoc } from "firebase/firestore";

// import { db } from "../firebase/firebase";

// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import PageTitle from "../components/PageTitle";

// function PetTipDetails() {
//   const { id } = useParams();
//   const [tip, setTip] = useState(null);

//   useEffect(() => {
//     const loadTip = async () => {
//       try {
//         const ref = doc(db, "petTips", id);
//         const snap = await getDoc(ref);

//         if (snap.exists()) {
//           setTip(snap.data());
//         }
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     loadTip();
//   }, [id]);

//   if (!tip) return null;

//   return (
//     <>
//       <Navbar />

//       <main className="fix">
//         <PageTitle title={tip.title} />

//         {/* PET TIP DETAILS */}
//         <section className="team__details-area">
//           <div className="container">
//             <div className="row justify-content-center">
//               {/* IMAGE */}
//               <div className="col-lg-5 col-md-8">
//                 <div className="team__details-img">
//                   <img
//                     src={tip.image}
//                     alt={tip.title}
//                     style={{
//                       width: "100%",
//                       borderRadius: "10px",
//                       objectFit: "cover",
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="col-lg-7">
//                 <div className="team__details-content">
//                   <h2 className="name">{tip.title}</h2>

//                   <span>{tip.category} Care Guide</span>

//                   <p>{tip.description}</p>

//                   {/* EXTRA SECTION */}
//                   <div className="experience-wrap">
//                     <h4 className="title">Pet Care Advice</h4>

//                     <p>
//                       Following proper care tips helps keep your pet healthy,
//                       active, and happy. Always ensure your pet gets proper
//                       nutrition, regular vet checkups, and plenty of love.
//                     </p>
//                   </div>

//                   {/* INFO */}
//                   <div className="contact__info-wrap team__details-info">
//                     <h6 className="title">Tip Information:</h6>

//                     <ul className="list-wrap">
//                       <li>
//                         <div className="icon">
//                           <i className="flaticon-user"></i>
//                         </div>
//                         PetPal Admin
//                       </li>

//                       <li>
//                         <div className="icon">
//                           <i className="flaticon-placeholder"></i>
//                         </div>
//                         Pet Care Knowledge Base
//                       </li>

//                       <li>
//                         <div className="icon">
//                           <i className="flaticon-mail"></i>
//                         </div>
//                         support@petpal.com
//                       </li>
//                     </ul>
//                   </div>

//                   {/* COMMENT FORM */}
//                   <div className="contact__form-wrap team__details-form">
//                     <form className="contact__form">
//                       <h2 className="title">Leave a Comment</h2>

//                       <span>
//                         Share your experience or ask questions about this tip.
//                       </span>

//                       <div className="row gutter-20">
//                         <div className="col-md-6">
//                           <div className="form-grp">
//                             <input type="text" placeholder="Name" />
//                           </div>
//                         </div>

//                         <div className="col-md-6">
//                           <div className="form-grp">
//                             <input type="email" placeholder="Email" />
//                           </div>
//                         </div>

//                         <div className="col-md-12">
//                           <div className="form-grp">
//                             <textarea placeholder="Comment"></textarea>
//                           </div>
//                         </div>
//                       </div>

//                       <button type="submit" className="btn">
//                         Post Comment
//                         <img
//                           src="/assets/img/icon/right_arrow.svg"
//                           alt=""
//                           className="injectable"
//                         />
//                       </button>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </>
//   );
// }

// export default PetTipDetails;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";

import Swal from "sweetalert2";

function PetTipDetails() {
  const { id } = useParams();

  const [tip, setTip] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadTip = async () => {
      try {
        const ref = doc(db, "petTips", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setTip(snap.data());
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadTip();
  }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "comments"), {
        tipId: id,
        name,
        email,
        message,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        icon: "success",
        title: "Comment Added!",
        text: "Thank you for sharing your thoughts.",
        confirmButtonColor: "#894B8D",
      });

      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit comment. Please try again.",
      });
    }
  };

  if (!tip) return null;

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title={tip.title} />

        <section className="team__details-area">
          <div className="container">
            <div className="row justify-content-center">
              {/* IMAGE */}
              <div className="col-lg-5 col-md-8">
                <div className="team__details-img">
                  <img
                    src={tip.image}
                    alt={tip.title}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              {/* CONTENT */}
              <div className="col-lg-7">
                <div className="team__details-content">
                  <h2 className="name">{tip.title}</h2>

                  <span>{tip.category} Care Guide</span>

                  <p>{tip.description}</p>

                  <div className="experience-wrap">
                    <h4 className="title">Pet Care Advice</h4>
                    <p>
                      Following proper care tips helps keep your pet healthy,
                      active, and happy. Always ensure your pet gets proper
                      nutrition and regular vet checkups.
                    </p>
                  </div>

                  {/* COMMENT FORM */}
                  <div className="contact__form-wrap team__details-form">
                    <form className="contact__form" onSubmit={submitComment}>
                      <h2 className="title">Leave a Comment</h2>

                      <span>
                        Share your experience or ask questions about this tip.
                      </span>

                      <div className="row gutter-20">
                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              type="text"
                              placeholder="Name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-grp">
                            <input
                              type="email"
                              placeholder="Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-grp">
                            <textarea
                              placeholder="Comment"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      <button type="submit" className="btn">
                        Post Comment
                        <img
                          src="/assets/img/icon/right_arrow.svg"
                          alt=""
                          className="injectable"
                        />
                      </button>
                    </form>
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

export default PetTipDetails;