import { Link, useNavigate } from "react-router-dom";

function PetCard({ pet }) {
  const navigate = useNavigate();

  return (
    <div className="col-xl-4 col-md-6">
      <div className="animal__item animal__item-two animal__item-three shine-animate-item">
     
        <div className="animal__thumb animal__thumb-two shine-animate">
          <Link to={`/petdetails/${pet.id}`}>
            <img
              src={
                pet.image
                  ? pet.image
                  : pet.categoryName?.toLowerCase() === "dog"
                    ? "/assets/img/pets/dog.png"
                    : pet.categoryName?.toLowerCase() === "cat"
                      ? "/assets/img/pets/cat.png"
                      : pet.categoryName?.toLowerCase() === "rabbit"
                        ? "/assets/img/pets/rabbit.png"
                        : "/assets/img/pet_placeholder.png"
              }
              alt={pet.name}
            />
          </Link>
        </div>

        <div className="animal__content animal__content-two">
          <h4 className="title">
            <Link to={`/petdetails/${pet.id}`}>{pet.name}</Link>
          </h4>

          <div className="pet-info">
            <ul className="list-wrap">
              <li>
                Gender: <span>{pet.gender}</span>
              </li>
              <li>
                Breed: <span>{pet.breed}</span>
              </li>
            </ul>
          </div>

          <div className="location">
            <i className="flaticon-placeholder"></i>
            <span>{pet.location}</span>
          </div>

          {/* Adopt Now */}
          <button
            className="btn btn-theme mt-3 w-100"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/petdetails/${pet.id}`, { state: { pet } });
            }}
          >
            Show Interest
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default PetCard;
