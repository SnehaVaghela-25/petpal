import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import PageTitle from "../components/PageTitle.jsx";
import Swal from "sweetalert2";
import { db } from "../firebase/firebase";

import { collection, addDoc } from "firebase/firestore";

 const contactSchema = z.object({
   name: z
     .string()
     .trim()
     .min(3, "Name must be at least 3 characters")
     .regex(/^[A-Za-z\s]+$/, "Name must contain only letters"),

   email: z.string().trim().email("Invalid email address"),

   message: z.string().trim().min(10, "Message must be at least 10 characters"),
 });
function Contact() {


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data) {
    try {
      await addDoc(collection(db, "contact"), {
        ...data,
        createdAt: new Date(),
      });

      Swal.fire({
        icon: "success",
        title: "Thank you for contacting us",
      });

      reset();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission failed",
        text: err.message,
      });
    }
  }
  return (
    <>

      {/* header-area */}
      <Navbar />
      {/* header-area-end */}

      {/* main-area */}
      <main className="fix">
        {/* breadcrumb-area */}
        <PageTitle title={"Contact Us"} />
        {/* breadcrumb-area-end */}

        {/* contact-area */}
        <section className="contact__area">
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <div className="contact__content">
                  <div className="section__title mb-30">
                    <h2 className="title">
                      We Are Always Available For You &amp; Your Pets
                    </h2>
                    <p>
                      Contact us for any inquiries regarding our pet care
                      services. We’re happy to assist you and your furry
                      companion.
                    </p>
                  </div>
                  <div className="contact__info-wrap">
                    <h6 className="title">Information:</h6>
                    <ul className="list-wrap">
                      <li>
                        <div className="icon">
                          <i className="flaticon-phone" />
                        </div>
                        <a href="">+123 8989 444</a>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="flaticon-placeholder" />
                        </div>
                        Anand - 388001, Gujarat, India
                      </li>
                      <li>
                        <div className="icon">
                          <i className="flaticon-mail" />
                        </div>
                        <a href="">info@gmail.com</a>
                      </li>
                      <li>
                        <div className="icon">
                          <i className="fas fa-share-alt" />
                        </div>
                        <ul className="list-wrap contact__social">
                          <li>
                            <a href="">
                              <i className="fab fa-facebook-f" />
                            </a>
                          </li>
                          <li>
                            <a href="">
                              <i className="fab fa-twitter" />
                            </a>
                          </li>
                          <li>
                            <a href="">
                              <i className="fab fa-whatsapp" />
                            </a>
                          </li>
                          <li>
                            <a href="">
                              <i className="fab fa-instagram" />
                            </a>
                          </li>
                          <li>
                            <a href="">
                              <i className="fab fa-youtube" />
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="contact__form-wrap">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    id="contact-form"
                    className="contact__form"
                  >
                    <h2 className="title">Send Us a Message</h2>
                    <span>
                      We respect your privacy. Your information will only be
                      used to respond to your inquiry.
                    </span>
                    <div className="row gutter-20">
                      <div className="col-md-6">
                        <div className="form-grp">
                          <input
                            type="text"
                            placeholder="Name"
                            {...register("name")}
                          />
                          <p className="text-danger">{errors.name?.message}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-grp">
                          {/* <input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          /> */}
                          <input
                            type="email"
                            placeholder="E-mail"
                            {...register("email")}
                          />
                          <p className="text-danger">{errors.email?.message}</p>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          {/* <textarea
                            name="message"
                            placeholder="Message"
                            defaultValue={""}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          /> */}
                          <textarea
                            placeholder="Message"
                            {...register("message")}
                          />
                          <p className="text-danger">
                            {errors.message?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <button type="button" className="btn" onClick={contact}>
                      Send Us Message{" "}
                      <img
                        src="/assets/img/icon/right_arrow.svg"
                        alt
                        className="injectable"
                      />
                    </button> */}
                    <button
                      type="submit"
                      className="btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Us Message"}
                    </button>
                  </form>
                  <p className="ajax-response mb-0" />
                </div>
              </div>
            </div>
            {/* contact-map */}
            <div className="contact-map">
              <iframe
                src="https://www.google.com/maps?q=Anand,Gujarat,India&output=embed"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {/* contact-map-end */}
          </div>
        </section>
        {/* contact-area-end */}
      </main>
      {/* main-area-end */}

      {/* footer-area */}
      <Footer />
      {/* footer-area-end */}
    </>
  );
}

export default Contact;
