
import { useUserStore } from "../store/userStore";
import { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useSelector } from "react-redux";
import { doc, query, collection, where, onSnapshot } from "firebase/firestore";
import { FaShoppingCart, FaBell, FaPaw, FaUserCircle } from "react-icons/fa";

function Navbar() {
  
  const userStore = useUserStore((state) => state.user);
  
  const logoutUser = useUserStore((state) => state.logout);

  const [notifications, setNotifications] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);


const [showProfileMenu, setShowProfileMenu] = useState(false);
const profileRef = useRef(null);


  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  useEffect(() => {
    if (!userStore?.uid) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userStore.uid),
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {

      console.log("Notifications snapshot:", snapshot.docs.length);

      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(results);
      setAlertCount(results.filter((n) => !n.seen).length);
    });

    return () => unsubscribe();
  }, [userStore]);


  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Logout */
  const handleLogout = async () => {
    await signOut(auth);
    logoutUser();
    navigate("/");
  };


  const menuItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 15px",
    textDecoration: "none",
    color: "#333",
    borderBottom: "1px solid #f1f1f1",
    fontSize: "14px",
    transition: "all 0.2s ease",
  };

  return (
    <header>
      <div id="header-fixed-height" />
      <div id="sticky-header" className="tg-header__area tg-header__area-three">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="tgmenu__wrap">
                <div className="row align-items-center">
                  {/* LEFT MENU */}
                  <div className="col-xl-5">
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                      <ul className="navigation">
                        <li>
                          <NavLink to="/">Home</NavLink>
                        </li>
                        <li>
                          <NavLink to="/about">About</NavLink>
                        </li>
                        <li>
                          <NavLink to="/allpet">Adopt Pet</NavLink>
                        </li>
                        <li className="menu-item-has-children">
                          <NavLink to="/services">Services</NavLink>
                          <ul className="sub-menu">
                            <li>
                              <NavLink to="/services">Pet Services</NavLink>
                            </li>
                            <li>
                              <NavLink to="/petboarding">Pet Boarding</NavLink>
                            </li>
                            <li>
                              <NavLink to="/petcaretips">Pet Care Tips</NavLink>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <NavLink to="/product">Shop</NavLink>
                        </li>
                        <li>
                          <NavLink to="/contact">Contact</NavLink>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* LOGO */}
                  <div className="col-xl-2 col-md-4 text-center">
                    <NavLink to="/">
                      <img src="/assets/img/logo/w_logo.png" alt="Logo" />
                    </NavLink>
                  </div>

                  {/* RIGHT MENU */}
                  <div className="col-xl-5 col-md-8">
                    <div className="tgmenu__action tgmenu__action-two d-none d-md-block">
                      <ul className="list-wrap">
                        {/* Notifications */}
                        {userStore?.uid && (
                          <li
                            className="notification-icon"
                            ref={notificationRef}
                            style={{ position: "relative" }}
                          >
                            <div
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={() =>
                                setShowNotifications(!showNotifications)
                              }
                            >
                              <FaBell style={{ color: "#FFD700" }} />
                              {alertCount > 0 && (
                                <span
                                  style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-10px",
                                    background: "red",
                                    color: "white",
                                    borderRadius: "50%",
                                    padding: "2px 6px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {alertCount}
                                </span>
                              )}
                            </div>
                            {showNotifications && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "35px",
                                  width: "300px",
                                  background: "#fff",
                                  borderRadius: "8px",
                                  boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                                  padding: "10px",
                                  zIndex: 999,
                                }}
                              >
                                <h6
                                  style={{
                                    borderBottom: "1px solid #eee",
                                    paddingBottom: "5px",
                                  }}
                                >
                                  Notifications
                                </h6>
                                {notifications.length === 0 ? (
                                  <p style={{ fontSize: "14px" }}>
                                    No notifications
                                  </p>
                                ) : (
                                  <>
                                    {notifications.slice(0, 5).map((n) => (
                                      <div
                                        key={n.id}
                                        style={{
                                          padding: "8px 0",
                                          borderBottom: "1px solid #eee",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {n.message}
                                      </div>
                                    ))}
                                    <div
                                      style={{
                                        textAlign: "center",
                                        marginTop: "8px",
                                      }}
                                    >
                                      <NavLink
                                        to="/notifications"
                                        onClick={() =>
                                          setShowNotifications(false)
                                        }
                                      >
                                        View All Notifications
                                      </NavLink>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </li>
                        )}

                        {/* Auth Links */}
                        {!userStore?.uid ? (
                          <>
                            <li>
                              <NavLink to="/login" className="btn">
                                Login
                              </NavLink>
                            </li>
                            <li>
                              <NavLink to="/register" className="btn">
                                Register
                              </NavLink>
                            </li>
                          </>
                        ) : (
                          <>
                            {/* Cart */}
                            <li className="cart-icon">
                              <NavLink to="/cart" className="cart-wrapper">
                                <FaShoppingCart />
                                {totalItems > 0 && (
                                  <span className="cart-badge">
                                    {totalItems}
                                  </span>
                                )}
                              </NavLink>
                            </li>

                            {/* My Pets */}
                            {/* <li>
                              <NavLink
                                to="/dashboard"
                                className="btn btn-theme"
                                style={{
                                  color: "white",
                                }}
                              >
                                <FaPaw /> My Pets
                              </NavLink>
                            </li> */}

                            {/* Logout */}
                            {/* <li>
                              <button onClick={handleLogout} className="btn">
                                Logout
                              </button>
                            </li> */}

                            {/* Profile */}
                            <li
                              ref={profileRef}
                              style={{
                                position: "relative",
                                listStyle: "none",
                              }}
                            >
                              <div
                                onClick={() =>
                                  setShowProfileMenu(!showProfileMenu)
                                }
                                style={{
                                  cursor: "pointer",
                                  width: "42px",
                                  height: "42px",
                                  borderRadius: "10px",
                                  background: "#894B8D",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                  fontSize: "20px",
                                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                                  transition: "0.2s",
                                }}
                              >
                                <FaUserCircle />
                              </div>

                              {showProfileMenu && (
                                <div
                                  style={{
                                    position: "absolute",
                                    right: "0",
                                    top: "45px",
                                    width: "200px",
                                    background: "#ffffff",
                                    borderRadius: "12px",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                                    zIndex: 999,
                                    overflow: "hidden",
                                    border: "1px solid #eee",
                                  }}
                                >
                                  {/* Header */}
                                  <div
                                    style={{
                                      background: "#002169",
                                      color: "white",
                                      padding: "12px",
                                      fontWeight: "600",
                                      textAlign: "center",
                                      fontSize: "14px",
                                    }}
                                  >
                                    My Account
                                  </div>

                                  {/* Menu Items */}
                                  <NavLink
                                    to="/profile"
                                    style={menuItemStyle}
                                    onClick={() => setShowProfileMenu(false)}
                                    onMouseEnter={(e) =>
                                      (e.target.style.background = "#f5f5f5")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.background = "white")
                                    }
                                  >
                                    👤 Profile
                                  </NavLink>

                                  <NavLink
                                    to="/dashboard"
                                    style={menuItemStyle}
                                    onClick={() => setShowProfileMenu(false)}
                                    onMouseEnter={(e) =>
                                      (e.target.style.background = "#f5f5f5")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.background = "white")
                                    }
                                  >
                                    🐾 My Pets
                                  </NavLink>

                                  {/* Logout */}
                                  <div
                                    onClick={handleLogout}
                                    style={{
                                      padding: "12px",
                                      textAlign: "center",
                                      background: "#894B8D",
                                      color: "white",
                                      cursor: "pointer",
                                      fontWeight: "600",
                                    }}
                                  >
                                    Logout
                                  </div>
                                </div>
                              )}
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;