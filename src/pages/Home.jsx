import Footer from "../components/Footer.jsx";
import Navbar from "../components/Navbar.jsx";
import { NavLink } from "react-router-dom";
import FeaturedPets from "../components/FeaturedPets.jsx";
import RecentlyAdoptedPets from "../components/RecentlyAdoptedPets";

function Home() {

  return (
    <>
      <Navbar />

      <main className="fix">
        {/* HERO / BANNER */}
        <section className="banner__area-two">
          <div
            className="banner__bg-two"
            data-background="/assets/img/banner/h2_banner_bg.jpg"
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xl-8">
                  <div className="banner__content-two">
                    <span className="sub-title">
                      Find your perfect companion
                    </span>

                    <h2 className="title">
                      Adopt a Pet & Give Them <br />a Loving Home
                    </h2>

                    <NavLink to="/allpet" className="btn">
                      Adopt Pet
                      <img
                        src="/assets/img/icon/right_arrow.svg"
                        alt=""
                        className="injectable"
                      />
                    </NavLink>
                  </div>
                </div>

                <div className="col-xl-4">
                  <img src="/assets/img/banner/h2_banner_img.png" alt="pet" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Pets */}
        <FeaturedPets />

        {/* Recently Adopted Pets */}
        <RecentlyAdoptedPets />

        {/* PetPal Features */}

        <section className="why__we-are-area-two">
          <div className="container">
            <div className="section__title text-center mb-40">
              <span className="sub-title">PetPal Features</span>
              <h2 className="title">Smart Pet Care Platform</h2>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="why__we-are-item text-center">
                  <h4>Adopt Pets</h4>
                  <p>Find loving pets available for adoption near you.</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="why__we-are-item text-center">
                  <h4>Health Tracking</h4>
                  <p>Track vaccination records and pet health history.</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="why__we-are-item text-center">
                  <h4>Pet Store</h4>
                  <p>Buy pet food, toys and accessories online.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about__area-two">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <img src="/assets/img/images/h2_about_img01.jpg" alt="about" />
              </div>

              <div className="col-lg-6">
                <div className="about__content-two">
                  <h2 className="title">We Care About Your Pets</h2>

                  <p>
                    PetPal helps you adopt pets, manage pet health, track
                    vaccinations, and shop pet products in one place.
                  </p>

                  <NavLink to="/about" className="btn">
                    Learn More
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY PETPAL */}
        <section className="why__we-are-area-two">
          <div className="container">
            <div className="section__title text-center mb-40">
              <h2 className="title">Why Choose PetPal</h2>
              <p>Your trusted platform for pet adoption and care</p>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-4">
                <div className="why__we-are-item">
                  <h4>Safe Adoption</h4>
                  <p>Verified pets with transparent adoption process.</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="why__we-are-item">
                  <h4>Pet Health Tracking</h4>
                  <p>Manage vaccination reminders and health records.</p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="why__we-are-item">
                  <h4>Pet Shop</h4>
                  <p>Buy high-quality pet food, toys and accessories.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="introducing__area">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <img src="/assets/img/images/introducing_img.png" alt="pets" />
              </div>

              <div className="col-lg-6">
                <h2 className="title">Start Your Pet Journey Today</h2>

                <p>
                  Join PetPal to adopt pets, track pet health, and connect with
                  trusted pet services.
                </p>

                <NavLink to="/allpet" className="btn">
                  Browse Pets
                </NavLink>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
