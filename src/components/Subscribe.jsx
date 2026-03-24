import { useState } from "react";
import { db } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";

function Subscribe() {
  let [email, setEmail] = useState("");

  async function subscribe() {
    let colRef = collection(db, "subscribes");

    await addDoc(colRef, {
      email: email,
      subscribed_at: serverTimestamp(),
    });

    Swal.fire({
      icon: "success",
      title: "Thank you for subscribing",
    });
    setEmail("");
  }

  return (
    <>
      <div className="footer__newsletter-three">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5">
              <div className="footer__newsletter-content">
                <h2 className="title">Sign Up For Newsletter!</h2>
              </div>
            </div>
            <div className="col-lg-7">
              <form action="#" className="footer__newsletter-form-two">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Type Your E-mail"
                />
                <button type="button" onClick={subscribe}>
                  Subscribe{" "}
                  <img
                    src="/assets/img/icon/right_arrow04.svg"
                    alt
                    className="injectable"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Subscribe;
