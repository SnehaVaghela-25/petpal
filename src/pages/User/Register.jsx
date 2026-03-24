import { useUserStore } from "../../store/userStore";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { db } from "../../firebase/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";
import Swal from "sweetalert2";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {

  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function Signup(data) {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const user = userCredentials.user;


      setUser(user);

      await setDoc(doc(db, "users", user.uid), {
        name: data.name,
        email: data.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
        role: "user",
      });

      Swal.fire({
        icon: "success",
        title: "Yeah...",
        text: "Registered Successfully!",
      });

      reset();

      navigate("/dashboard");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Hummp...",
        text: error.message,
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
        <PageTitle title={"Register"} />
        {/* breadcrumb-area-end */}

        {/* contact-area */}
        <section className="contact__area">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 mx-auto">
                <div className="contact__form-wrap">
                  <form
                    onSubmit={handleSubmit(Signup)}
                    className="contact__form"
                  >
                    <h2 className="title">Signup</h2>
                    <span>
                      Your name,email address and password are required to
                      signup.
                    </span>
                    <div className="row gutter-20">
                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="text"
                            placeholder="Name"
                            {...register("name", {
                              required: "Name is required",
                              minLength: {
                                value: 3,
                                message: "Minimum 3 characters required",
                              },
                            })}
                          />
                          <p className="text-danger">{errors.name?.message}</p>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="email"
                            placeholder="E-mail"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email format",
                              },
                            })}
                          />
                          <p className="text-danger">{errors.email?.message}</p>
                        </div>
                      </div>

                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="password"
                            placeholder="Password"
                            {...register("password", {
                              required: "Password is required",
                              minLength: {
                                value: 6,
                                message: "Minimum 6 characters required",
                              },
                            })}
                          />
                          <p className="text-danger">
                            {errors.password?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Signup"}
                    </button>
                  </form>
                  <p className="ajax-response mb-0" />
                </div>
              </div>
            </div>
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

export default Register;
