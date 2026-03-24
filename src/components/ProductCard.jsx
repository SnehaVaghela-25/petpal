import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="col">
      <div className="product__item">
        <div className="product__thumb">
          {/* PASS PRODUCT ID */}
          <Link to={`/productdetails/${product.id}`}>
            <div className="product-img">
              <img src={product.image} alt={product.title} />
            </div>
          </Link>

          {product.badge && (
            <div
              className={`sale-wrap ${
                product.badge === "Sale" ? "sale-wrap-two" : ""
              }`}
            >
              <span>{product.badge}</span>
            </div>
          )}
          <div className="product__add-cart">
            <Link to={`/productdetails/${product.id}`} className="btn">
              <i className="flaticon-shopping-bag" />
              View Details
            </Link>
          </div>
        </div>

        <div className="product__content">
          <div className="product__reviews">
            <div className="rating">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fas fa-star" />
              ))}
            </div>
            <span>({product.reviews} Reviews)</span>
          </div>

          <h4 className="title">
            <Link to={`/productdetails/${product.id}`}>{product.title}</Link>
          </h4>

          <h3 className="price">
            {product.stock === 0 ? (
              <span style={{ color: "red" }}>Out of Stock</span>
            ) : (
              <>₹{Number(product.price).toFixed(2)}</>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
