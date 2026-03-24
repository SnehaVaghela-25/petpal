import { useUserStore } from "../../store/userStore";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { bookService } from "../../services/petService";

import { startRazorpayPayment } from "../../utils/razorpay";

function BookService({ serviceId, serviceName, servicePrice, onSuccess }) {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const [petName, setPetName] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const advance = 200;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    // ✅ Validation
    if (!petName || !date) {
      setMessage("Please fill all fields");
      setLoading(false);
      return;
    }

    if (!user?.uid) {
      setMessage("Please login first");
      setLoading(false);
      return;
    }

    try {
      // 💳 Step 1: Payment
      const success = await startRazorpayPayment({
        amount: advance,
        user: user,
        serviceType: "service",
        referenceId: serviceId,
      });

      if (!success) {
        setMessage("Payment failed");
        setLoading(false);
        return;
      }

      // 📦 Step 2: Save booking (ONLY ONCE)
      await bookService({
        serviceId,
        serviceName,
        petName,
        date,
        userId: user.uid,
        userEmail: user.email,

        paidAmount: advance,
        remainingAmount: servicePrice - advance || 0,
        paymentStatus: "partial",
        paymentType: "advance",
      });

      setMessage("Service booked successfully!");

      setPetName("");
      setDate("");

      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    } catch (error) {
      console.error(error);
      setMessage("Booking failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <form className="petpal-book-form" onSubmit={handleSubmit}>
      <div className="form-group mb-3">
        <label className="form-label">Pet Name</label>

        <input
          type="text"
          className="form-control petpal-input"
          placeholder="Enter your pet name"
          required
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
        />
      </div>

      <div className="form-group mb-3">
        <label className="form-label">Select Date</label>

        <input
          type="date"
          className="form-control petpal-input"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {message && (
        <div
          className={`booking-message mb-3 ${
            message.includes("success") ? "text-success" : "text-danger"
          }`}
        >
          {message}
        </div>
      )}

      <button type="submit" className="btn petpal-btn w-100" disabled={loading}>
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}

export default BookService;
