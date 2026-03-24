import { useEffect } from "react";
import BookService from "./BookService";

function ServiceModal({ service, onClose }) {
  useEffect(() => {
    const scrollY = window.scrollY;

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="btn-close float-end" onClick={onClose}></button>

        <h4 className="mb-3">Book {service.name}</h4>

        <p className="text-muted">{service.description}</p>

        <h5 className="text-primary mb-3">₹{service.price}</h5>

        <BookService
          serviceId={service.id}
          serviceName={service.name}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}

export default ServiceModal;
