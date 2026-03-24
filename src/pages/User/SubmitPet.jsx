import { useState, useRef, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { storage, db } from "../../firebase/firebase.js";

import Swal from "sweetalert2";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import PageTitle from "../../components/PageTitle.jsx";

function SubmitPet() {
  let [name, setName] = useState("");
  let [owner, setOwner] = useState("");
  let [email, setEmail] = useState("");
  let [age, setAge] = useState("");
  let [phone, setPhone] = useState("");
  let [color, setColor] = useState("");
  let [type, setType] = useState("");
  let [justification, setJustification] = useState("");
  let [address, setAddress] = useState("");

  let fileRef = useRef();

  let [categories, setCategories] = useState([]);

   useEffect(() => {
     const colRef = collection(db, "categories");

     const unsub = onSnapshot(colRef, (snapshot) => {
       const result = snapshot.docs.map((doc) => ({
         id: doc.id,
         ...doc.data(),
       }));
       setCategories(result);
     });

     return () => unsub();
   }, []);
   
  let [image, setImage] = useState("");

  async function addPet(e) {
    if (image === "") {
      Swal.fire({
        icon: "error",
        title: "Please select an image",
      });
      return;
    }

    let imageRef = ref(storage, `images/${image.name}`);

    await uploadBytes(imageRef, image);

    let imageUrl = await getDownloadURL(imageRef);
    console.log("Image URL:", imageUrl);

    let colRef = collection(db, "pets");
    await addDoc(colRef, {
      owner: owner,
      name: name,
      email: email,
      url: imageUrl,
      age: age,
      phone: phone,
      color: color,
      type: type,
      justification: justification,
      address: address,
    });
    console.log("Pet added successfully");

    Swal.fire({
      icon: "success",
      title: "Pet Added Successfully",
    });

    console.log(name, email, age, mobile, color, type, justification, address);
  }
  return (
    <>

        {/* header-area */}
        <Navbar />
        {/* header-area-end */}

        {/* main-area */}
        <main className="fix">
          {/* breadcrumb-area */}
          <PageTitle title={"Add Your Pet"} />
          {/* breadcrumb-area-end */}

          {/* registration-area */}
          <section className="registration__area-two">
            <div className="container">
              <div className="registration__inner-wrap-two">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="registration__form-wrap">
                      <form className="registration__form">
                        <h3 className="title">Add Pet</h3>
                        <span>
                          Your email address will not be published. Required
                          fields are marked *
                        </span>
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
                                type="number"
                                placeholder="Age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-grp select-grp">
                              <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                              >
                                <option value="">Select Type</option>
                                {categories.map((c) => (
                                  <option key={c.id} value={c.name}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-grp">
                              <input
                                type="text"
                                placeholder="Color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-grp select-grp">
                              <input
                                type="file"
                                accept="image/*"
                                ref={fileRef}
                                style={{ display: "none" }}
                                onChange={(e) => setImage(e.target.files[0])}
                              />
                              {/* Button to trigger file input */}
                              <button
                                type="button"
                                className="btn w-100"
                                onClick={() => fileRef.current.click()}
                              >
                                Add Pic
                                <img
                                  src="/assets/img/icon/right_arrow.svg"
                                  alt=""
                                  className="injectable"
                                />
                              </button>
                            </div>
                          </div>

                          <div className="col-md-12">
                            <div className="form-grp ">
                              <textarea
                                name="address"
                                placeholder="Address . . ."
                                defaultValue={""}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-grp">
                              <input
                                type="text"
                                placeholder="Pet Owner Name"
                                value={owner}
                                onChange={(e) => setOwner(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-grp">
                              <input
                                type="email"
                                placeholder="Pet Parent Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-grp">
                              <input
                                type="tel"
                                placeholder="Pet Owner Phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="form-grp">
                              <textarea
                                name="justification"
                                placeholder="Justification . . ."
                                defaultValue={""}
                                value={justification}
                                onChange={(e) =>
                                  setJustification(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <button type="button" className="btn" onClick={addPet}>
                          Add Pet{" "}
                          <img
                            src="/assets/img/icon/right_arrow.svg"
                            alt
                            className="injectable"
                          />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="registration__img">
                      <img
                        src="/assets/img/images/registration_img.png"
                        alt
                        data-aos="fade-right"
                        data-aos-delay={400}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* registration-area-end */}
        </main>
        {/* main-area-end */}

        {/* footer-area */}
        <Footer />
        {/* footer-area-end */}
    </>
  );
}

export default SubmitPet;
