import { useLocation, useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function PaymentSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h3 className="text-center mt-5">No Payment Found</h3>;
  }

  const { paymentId, amount, serviceType } = state;

  return (
    <>
      <Navbar />

      <main className="fix">
        <section className="payment-success-area text-center">
          <div className="container">
            <div className="success-box">
              <h2>Payment Successful 🎉</h2>

              <p>Your transaction was completed successfully.</p>

              <div className="receipt-box">
                <p>
                  <strong>Payment ID:</strong> {paymentId}
                </p>
                <p>
                  <strong>Service:</strong> {serviceType}
                </p>
                <p>
                  <strong>Amount Paid:</strong> ₹{amount}
                </p>
              </div>

              <button className="btn mt-3" onClick={() => navigate("/")}>
                Go to Home
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default PaymentSuccess;
