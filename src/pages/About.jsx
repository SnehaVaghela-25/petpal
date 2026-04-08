
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <main className="fix">
        <PageTitle title="About Us" />

        {/* About Section */}
        <section className="about__area-four">
          <div className="container">
            <div className="row align-items-center justify-content-center">
              <div className="col-lg-6 col-md-8">
                <div className="about__img-four">
                  <img
                    src="/assets/img/images/inner_about_img01.jpg"
                    alt="PetPal"
                    data-aos="fade-right"
                  />

                  <img
                    src="/assets/img/images/inner_about_img02.jpg"
                    alt="Pets"
                    data-aos="fade-left"
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="about__content-four">
                  <div className="section__title mb-15">
                    <span className="sub-title">About PetPal</span>

                    <h2 className="title">
                      Caring for Pets <br /> Like Family
                    </h2>
                  </div>

                  <p>
                    PetPal is a platform built for pet lovers to manage
                    everything related to their pets in one place. From tracking
                    pet health records to booking services and learning useful
                    care tips, PetPal makes pet care simple and convenient.
                  </p>

                  <p>
                    Our goal is to create a digital companion for every pet
                    owner so pets stay healthy, happy, and well cared for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PetPal Features */}
        <section className="features__area pt-100 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section__title text-center mb-50">
                  <span className="sub-title">PetPal Features</span>
                  <h2 className="title">How PetPal Helps You</h2>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              {/* Feature 1 */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="feature__card text-center p-4"
                  data-aos="fade-up"
                >
                  <div className="feature__icon mb-3">
                    <img src="/assets/img/icon/why_icon01.svg" alt="health" />
                  </div>

                  <h4>Pet Health Records</h4>

                  <p>
                    Easily track vaccinations, health history, and medical
                    records for your pets.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="feature__card text-center p-4"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="feature__icon mb-3">
                    <img src="/assets/img/icon/why_icon02.svg" alt="services" />
                  </div>

                  <h4>Pet Services</h4>

                  <p>
                    Book grooming, boarding, and other pet services easily from
                    one place.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="feature__card text-center p-4"
                  data-aos="fade-up"
                  data-aos-delay="400"
                >
                  <div className="feature__icon mb-3">
                    <img src="/assets/img/icon/why_icon03.svg" alt="tips" />
                  </div>

                  <h4>Pet Care Tips</h4>

                  <p>
                    Learn useful pet care tips, feeding guides, and health
                    advice from experts.
                  </p>
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

export default About;