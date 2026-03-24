import { useUserStore } from "../../store/userStore";

import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import {
  fetchSignInMethodsForEmail,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";
import Swal from "sweetalert2";

function Login() {

  const loginUser = useUserStore((state) => state.login);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.redirectTo;

  // EMAIL/PASSWORD LOGIN
  async function SignIn(data) {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, data.email);

      if (signInMethods.length === 0) {
        return Swal.fire({
          icon: "error",
          title: "No User Found",
          text: "This email is not registered!",
        });
      }

      const userCredentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      const docSnap = await getDoc(doc(db, "users", userCredentials.user.uid));

      if (!docSnap.exists()) {
        return Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "User data not found in database!",
        });
      }

      const role = docSnap.data().role;

      if (role === "admin") {
        return Swal.fire({
          icon: "error",
          title: "Admin Login Not Allowed",
          text: "Please use the admin panel to login.",
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome Back!",
        timer: 1500,
        showConfirmButton: false,
      });

      loginUser({
        uid: userCredentials.user.uid,
        email: userCredentials.user.email,
        role,
      });

      reset();
      navigate(redirectTo || "/");
      
    } catch (error) {
      let message = error.message;

      if (error.code === "auth/wrong-password") {
        message = "Please enter the correct password!";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts! Try again later.";
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });
    }
  }

  // GOOGLE LOGIN (Regular users only)
  async function signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredentials = await signInWithPopup(auth, provider);

      const docSnap = await getDoc(doc(db, "users", userCredentials.user.uid));

      if (!docSnap.exists()) {
        return Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "User data not found in database!",
        });
      }

      const role = docSnap.data().role;

      if (role === "admin") {
        return Swal.fire({
          icon: "error",
          title: "Admin Login Not Allowed",
          text: "Please use email/password login for admin.",
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome Back!",
        timer: 1500,
        showConfirmButton: false,
      });

      loginUser({
        uid: userCredentials.user.uid,
        email: userCredentials.user.email,
        role,
      });

      navigate(redirectTo || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Login Failed",
        text: error.message,
      });
    }
  }

  return (
    <>
      <Navbar />
      <main className="fix">
        <PageTitle title="Login" />
        <section className="contact__area">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 mx-auto">
                <div className="contact__form-wrap">
                  <form
                    onSubmit={handleSubmit(SignIn)}
                    className="contact__form"
                  >
                    <h2 className="title">Login</h2>
                    <span>
                      Your email address and password are required to login.
                    </span>
                    <div className="row gutter-20">
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
                      className="btn btn-login"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                    <div className="divider">
                      <span>OR</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-google"
                      onClick={signInWithGoogle}
                    >
                      <img
                        src="/assets/img/icon/google.png"
                        alt="Google"
                        className="google-icon"
                      />
                      Sign in with Google
                    </button>
                  </form>
                  <p className="ajax-response mb-0" />
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

export default Login;

