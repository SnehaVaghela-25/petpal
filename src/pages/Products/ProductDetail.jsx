
import { useUserStore } from "../../store/userStore";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice.js";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import Swal from "sweetalert2";

function ProductDetail() {
  const user = useUserStore((state) => state.user);
  const loading = false; 


  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({
            id: docSnap.id,
            ...docSnap.data(),
          });
        } else {
          console.log("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      navigate("/login", {
        state: { redirectTo: "/cart" },
      });
      return;
    }

    dispatch(addToCart({ product, quantity }));
    navigate("/cart");
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login", {
        state: { redirectTo: "/cart" },
      });
      return;
    }

    dispatch(addToCart({ product, quantity }));

    Swal.fire({
      icon: "success",
      title: "Added to Cart",
      text: `${product.title} has been added to your cart.`,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  if (!product) {
    return (
      <div className="text-center mt-5">
        <h3>Loading Product...</h3>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title="Product Details" />

        <section className="product__details-area">
          <div className="container">
            <div className="row">
              {/* Product Image */}
              <div className="col-lg-6">
                <div className="product__details-images-wrap text-center">
                  <img
                    src={product.image || "/images/no-product.png"}
                    alt={product.title}
                    style={{ maxHeight: "400px", objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="col-lg-6">
                <div className="product__details-content">
                  <span className="tag">{product.category}</span>

                  <h2 className="title">{product.title}</h2>

                  <h4 className="price">₹{product.price}</h4>

                  <p>{product.description}</p>

                  {/* Sizes (optional) */}
                  {product.sizes && (
                    <div className="product__size-wrap">
                      <span className="size-title">Size:</span>
                      <ul className="list-wrap">
                        {product.sizes.map((size, index) => (
                          <li key={index}>
                            <button>{size}</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="product__details-qty">
                    <div className="cart-plus-minus">
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="qty-input"
                      />
                    </div>

                    <button className="add-btn" onClick={handleAddToCart}>
                      Add To Cart
                    </button>
                  </div>

                  {/* Buy Now */}
                  <button className="buy-btn" onClick={handleBuyNow}>
                    Buy it Now
                  </button>

                  {/* Category */}
                  {product.category && (
                    <div className="product__details-bottom mt-4">
                      <span className="title">Category: </span>
                      <span>{product.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default ProductDetail;