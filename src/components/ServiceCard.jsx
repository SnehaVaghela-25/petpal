import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceModal from "../pages/Services/ServiceModal";

function ServiceCard({ service }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleBook = () => {
    if (service.name === "Pet Boarding") {
      navigate("/petboarding");
      return;
    }

    setShowModal(true);
  };

  return (
    <>
      <div className="col">
        <div className="service-card">
          <div className="service-img">
            <img src={service.image} alt={service.name} />
          </div>

          <div className="service-body">
            <h4 className="service-title">{service.name}</h4>

            <p className="service-desc">{service.description}</p>

            <div className="service-bottom">
              <h5 className="service-price">₹{service.price}</h5>

              <button className="btn petpal-btn" onClick={handleBook}>
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <ServiceModal service={service} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}

export default ServiceCard;
