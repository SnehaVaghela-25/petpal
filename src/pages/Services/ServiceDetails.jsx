import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServiceById } from "../../services/petService";
import BookService from "./BookService";

function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      const data = await getServiceById(id);
      setService(data);
    };

    fetchService();
  }, [id]);

  if (!service) return <h3 className="text-center mt-5">Loading...</h3>;

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={service.image || "/images/no-service.png"}
            alt={service.name}
            className="img-fluid rounded shadow"
            style={{ height: "350px", objectFit: "cover", width: "100%" }}
          />
        </div>

        <div className="col-md-6">
          <h2>{service.name}</h2>
          <p className="text-muted">{service.description}</p>
          <h3 className="text-primary mb-4">₹{service.price}</h3>

          <BookService
            serviceId={service.id}
            serviceName={service.name}
            servicePrice={service.price}
          />
        </div>
      </div>
    </div>
  );
}

export default ServiceDetails;
