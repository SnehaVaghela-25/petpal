import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state;

  const paymentMethod = state?.paymentMethod;
  const orderStatus = state?.orderStatus;
  const depositAmount = state?.depositAmount;


  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
    {
      paymentMethod === "Cash on Delivery" && (
        <p>Please pay at the time of delivery.</p>
      );
    }

    {
      paymentMethod === "Online Payment" && (
        <p>Your payment has been received successfully.</p>
      );
    }
  }, [state, navigate]);

  if (!state) return null; 

  return (
    <>
      <Navbar />

      <div className="container text-center py-5">
        <h2>🎉 Order Placed Successfully!</h2>

        <p>
          Payment Method: <strong>{paymentMethod}</strong>
        </p>

        <p>
          Order Status: <strong>{orderStatus}</strong>
        </p>

        {depositAmount > 0 && (
          <p>
            Deposit Amount: <strong>₹{depositAmount.toFixed(2)}</strong>
          </p>
        )}

        <p>Our team will review your order shortly.</p>

        <Link to="/product" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>

      <Footer />
    </>
  );
}
