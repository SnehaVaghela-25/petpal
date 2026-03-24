
import { useUserStore } from "../../store/userStore";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { doc, addDoc, getDoc, updateDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PageTitle from "../../components/PageTitle";

import { clearCart } from "../../store/cartSlice";
import { useState } from "react";
import Swal from "sweetalert2";

import { startRazorpayPayment } from "../../utils/razorpay";

export default function Checkout() {

  const user = useUserStore((state) => state.user);

  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "product";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const depositAmount = type === "product" ? 0 : totalPrice * 0.2;

  const expiryTime =
    type !== "product"
      ? new Date().getTime() + 48 * 60 * 60 * 1000
      : null;

  const saveOrder = async (method, paymentId = null) => {
    if (!user || !user.uid || !user.email) {
      Swal.fire({
        icon: "error",
        title: "Not Logged In",
        text: "Please login again.",
      });
      return;
    }

    try {
      await updateStock(); 

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        userEmail: user.email,

        name,
        phone,
        address,

        items: cartItems,
        totalAmount: totalPrice,
        depositAmount,

        paymentMethod: method,
        paymentId,

        type,
        orderStatus: "REQUESTED",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiryTime,
      });

      dispatch(clearCart());

      navigate("/ordersuccess", {
        state: {
          paymentMethod: method,
          orderStatus: "REQUESTED",
          depositAmount,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // 🔹 Razorpay Payment
  // const loadRazorpay = () => {

  //   const options = {
  //     key: "YOUR_RAZORPAY_KEY",

  //     amount: (depositAmount > 0 ? depositAmount : totalPrice) * 100,
  //     currency: "INR",

  //     name: "PetPal",
  //     description: "PetPal Order Payment",

  //     handler: async function (response) {
  //       await saveOrder("Online Payment", response.razorpay_payment_id);
  //     },

  //     prefill: {
  //       name: name,
  //       email: auth.currentUser?.email,
  //       contact: phone,
  //     },

  //     theme: {
  //       color: "#ff6b6b",
  //     },
  //   };

  //   const rzp = new window.Razorpay(options);
  //   rzp.open();
  // };

  // 🔹 Place Order Button
  const handlePlaceOrder = async () => {

    if (cartItems.length === 0) {
      // alert("Cart is empty");
      Swal.fire({
        icon: "info",
        title: "Your Cart is Empty",
        text: "Please add items to your cart before checkout.",
        confirmButtonColor: "#ff6b6b",
      });
      return;
    }

    if (!name || !phone || !address) {
  Swal.fire({
    icon: "warning",
    title: "Missing Information",
    text: "Please fill in your name, phone number, and address before placing the order.",
    confirmButtonColor: "#ff6b6b",
  });
  return;
}

    if (paymentMethod === "Online Payment") {
      const result = await startRazorpayPayment({
        amount: depositAmount > 0 ? depositAmount : totalPrice,
        user: user,
        serviceType: type,
        referenceId: "order_" + Date.now(),
      });

      if (!result || !result.success) return;

      await saveOrder("Online Payment", result.paymentId);
    } else {
      await saveOrder("Cash on Delivery");
    }
  };

  const updateStock = async () => {
    for (const item of cartItems) {
      const productRef = doc(db, "products", item.id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) continue;

      const currentStock = productSnap.data().stock || 0;

      if (currentStock < item.quantity) {
        Swal.fire({
          icon: "error",
          title: "Out of Stock",
          text: `${item.name} is not available in requested quantity.`,
        });
        throw new Error("Stock issue"); 
      }

      await updateDoc(productRef, {
        stock: currentStock - item.quantity,
      });
    }
  };
  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title="Checkout" />

        <div className="container py-5">
          <div className="row">
            {/* LEFT SIDE - USER DETAILS */}
            <div className="col-md-6">
              <h4 className="mb-4">Customer Information</h4>

              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Delivery Address</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* RIGHT SIDE - ORDER SUMMARY */}
            <div className="col-md-6">
              <h4 className="mb-4">Order Summary</h4>

              <div className="card p-4">
                <h5>Total Amount: ₹{totalPrice}</h5>

                {depositAmount > 0 && (
                  <p className="text-danger">
                    Deposit Required: ₹{depositAmount}
                  </p>
                )}

                <div className="mt-3">
                  <label className="form-label">Payment Method</label>

                  <select
                    className="form-control"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option>Cash on Delivery</option>
                    <option>Online Payment</option>
                  </select>
                </div>

                <button
                  className="btn btn-theme mt-4 w-100"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}