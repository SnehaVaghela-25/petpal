
///      My Test key----rzp_test_SSFhLob8lhW37A
///      Never this use in frontend      ---        test key secret--hxzFBYmGggyIQfHd0JpvJLy1

import Swal from "sweetalert2";
import { db } from "../firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const startRazorpayPayment = async ({
  amount,
  user,
  serviceType,
  referenceId,
}) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      Swal.fire("Error", "Razorpay SDK not loaded", "error");
      return reject(null);
    }

    const options = {
      key: "rzp_test_SSFhLob8lhW37A", // ✅ your test key

      amount: amount * 100,
      currency: "INR",

      name: "PetPal",
      description: `${serviceType} Payment`,

      handler: async function (response) {
        try {
          const paymentData = {
            userId: user.uid,
            email: user.email,
            serviceType,
            referenceId,
            amount,
            paymentId: response.razorpay_payment_id,
            status: "success",
            createdAt: serverTimestamp(),
          };

          await addDoc(collection(db, "payments"), paymentData);

          Swal.fire({
            icon: "success",
            title: "Payment Successful 🎉",
          });

          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            amount,
          });
        } catch (error) {
          console.error(error);
          reject(null);
        }
      },

      modal: {
        ondismiss: function () {
          Swal.fire({
            icon: "warning",
            title: "Payment Cancelled",
          });
          resolve(null);
        },
      },

      prefill: {
        name: user?.displayName || "",
        email: user?.email || "",
      },

      theme: {
        color: "#ff4b2b",
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response) {
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: response.error.description,
      });
      reject(null);
    });

    rzp.open();
  });
};