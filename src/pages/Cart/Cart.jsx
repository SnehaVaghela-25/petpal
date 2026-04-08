import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import PageTitle from "../../components/PageTitle.jsx";
import { useEffect } from "react";
import {
  fetchCart,
  syncCart,
  clearCart,
  removeFromCart,
} from "../../store/cartSlice";

import { useUserStore } from "../../store/userStore";


function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      dispatch(clearCart());
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchCart(user.uid));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user?.uid) {
      dispatch(syncCart({ uid: user.uid, cartItems }));
    }
  }, [cartItems, user, dispatch]);

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const totalPrice = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0,
  );
 
  const handleCheckout = () => {
    if (!user) {
      navigate("/login", {
        state: { redirectTo: "/checkout?type=product" },
      });
      return;
    }

    navigate("/checkout?type=product");
  };

  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title="Cart" />

        <section className="cart-area section-py-120">
          <div className="container">
            {cartItems.length === 0 ? (
              <div className="text-center py-5">
                <h3 className="mb-3">
                  Your cart is empty
                  <img
                    src="/assets/img/empty_cart.png"
                    alt="Empty Cart"
                    style={{ height: "120px", objectFit: "contain" }}
                  />
                </h3>
                <p className="text-muted mb-4">
                  Browse products and add items to your cart.
                </p>
                <Link to="/product" className="btn btn-primary px-4">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="row g-4 align-items-start">
                <div className="col-lg-8">
                  <div className="card shadow-sm">
                    <div className="card-body p-0">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="d-flex align-items-center px-3 py-3 border-bottom"
                        >
                          <div className="me-3" style={{ width: "80px" }}>
                            <img
                              src={item.image}
                              alt={item.title}
                              className="img-fluid rounded border"
                            />
                          </div>

                          <div className="flex-grow-1">
                            <h6>{item.title}</h6>
                            <small>₹{item.price} each</small>
                          </div>

                          <div className="text-center me-3">
                            {item.quantity}
                          </div>

                          <div className="fw-semibold me-3">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>

                          <button
                            className="btn btn-danger"
                            onClick={() => dispatch(removeFromCart(item.id))}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <h5>Order Summary</h5>

                      <div className="d-flex justify-content-between">
                        <span>Items</span>
                        <span>{totalQuantity}</span>
                      </div>

                      <div className="d-flex justify-content-between">
                        <span>Subtotal</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>

                      <hr />

                      <div className="d-flex justify-content-between fw-semibold">
                        <span>Total</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={handleCheckout}
                        className="btn btn-theme w-100 mt-3"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Cart;
