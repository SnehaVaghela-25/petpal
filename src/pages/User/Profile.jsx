import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useUserStore } from "../../store/userStore";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";
import Swal from "sweetalert2";

function Profile() {
  const userStore = useUserStore((state) => state.user);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserData() {
      if (!userStore?.uid) {
        navigate("/login");
        return;
      }

      try {
        const docSnap = await getDoc(doc(db, "users", userStore.uid));
        if (!docSnap.exists()) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "User data not found!",
          });
          return;
        }

        const userData = docSnap.data();
        reset({
          name: userData.name || "",
          email: userData.email || "",
          badge: userData.badge || "",
        });
        setLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message,
        });
      }
    }

    fetchUserData();
  }, [userStore, reset, navigate]);

  async function onSubmit(data) {
    try {
      await updateDoc(doc(db, "users", userStore.uid), {
        name: data.name,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message,
      });
    }
  }

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Navbar />
      <main className="fix">
        <PageTitle title="Profile" />
        <section className="contact__area">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 mx-auto">
                <div className="contact__form-wrap">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="contact__form"
                  >
                    <h2 className="title">Your Profile</h2>
                    <span>Update your details</span>
                    <div className="row gutter-20">
                      <div className="col-md-12">
                        <div className="form-grp">
                          <input
                            type="text"
                            placeholder="Name"
                            {...register("name", {
                              required: "Name is required",
                              minLength: {
                                value: 2,
                                message: "Minimum 2 characters",
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
                            placeholder="Email"
                            {...register("email")}
                            disabled
                          />
                        </div>
                      </div>

                    </div>

                    <button
                      type="submit"
                      className="btn btn-login"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Update Profile"}
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

export default Profile;
