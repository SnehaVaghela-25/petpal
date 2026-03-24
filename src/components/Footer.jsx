import Subscribe from "./Subscribe";
import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";

function Footer() {
const [user, setUser] = useState(null);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

  return (
    <>
      <footer>
        <div className="footer__area">
          {/* Subscribe */}
          <Subscribe />

          <div className="footer__top footer__top-three fix">
            <div className="container">
              <div className="row">
                {/* Logo + About */}
                <div className="col-xl-3 col-lg-4 col-md-6">
                  <div className="footer__widget">
                    <div className="footer__logo">
                      <Link to="/">
                        <img src="/assets/img/logo/w_logo.png" alt="PetPal" />
                      </Link>
                    </div>

                    <div className="footer__content footer__content-two">
                      <p>
                        PetPal helps pet owners manage their pets’ health,
                        services, and care easily in one place. Track
                        vaccinations, book services, and learn helpful pet care
                        tips.
                      </p>
                    </div>

                    <div className="footer__social">
                      <h6 className="title">Follow Us</h6>

                      {/* <ul className="list-wrap">
                        <li>
                          <Link to="/contact">Contact Us</Link>
                        </li>

                        <li>
                          <Link to="/services">Pet Services</Link>
                        </li>

                        <li>
                          <Link to="/petboarding">Pet Boarding</Link>
                        </li>

                        {user && (
                          <li>
                            <Link to="/dashboard">Dashboard</Link>
                          </li>
                        )}
                      </ul> */}
                      <ul className="list-wrap">
                        <li><a href="#" target="_blank"><i className="fab fa-facebook-f"></i></a></li>
                        <li><a href="" target="_blank"><i className="fab fa-twitter"></i></a></li>
                        <li><a href="" target="_blank"><i className="fab fa-whatsapp"></i></a></li>
                        <li><a href="" target="_blank"><i className="fab fa-instagram"></i></a></li>
                        <li><a href="" target="_blank"><i className="fab fa-youtube"></i></a></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <h4 className="footer__widget-title">Quick Links</h4>

                    <div className="footer__link">
                      <ul className="list-wrap">
                        <li>
                          <Link to="/">Home</Link>
                        </li>

                        <li>
                          <Link to="/about">About</Link>
                        </li>

                        <li>
                          <Link to="/services">Services</Link>
                        </li>

                        <li>
                          <Link to="/allpets">Adopt Pets</Link>
                        </li>

                        <li>
                          <Link to="/petcaretips">Pet Care Tips</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Support */}
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <h4 className="footer__widget-title">Support</h4>

                    <div className="footer__link">
                      <ul className="list-wrap">
                        <li>
                          <Link to="/contact">Contact Us</Link>
                        </li>

                        <li>
                          <Link to="/services">Pet Services</Link>
                        </li>

                        <li>
                          <Link to="/petboarding">Pet Boarding</Link>
                        </li>

                        <li>
                          <Link to="/dashboard">My Dashboard</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                  <div className="footer__widget">
                    <h4 className="footer__widget-title">Contact</h4>

                    <div className="footer__contact">
                      <ul className="list-wrap">
                        <li>Anand, Gujarat, India</li>

                        <li>+91 98765 43210</li>

                        <li>support@petpal.com</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer__bottom footer__bottom-two">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <div className="copyright-text text-center">
                    <p>
                      © {new Date().getFullYear()} PetPal. All Rights Reserved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;
