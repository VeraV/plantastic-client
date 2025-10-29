import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import HeroImage from "../assets/hero.png";

export const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      {/* Hero */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            {/* Left column — text */}
            <div className="col-md-6 text-center text-md-start mb-4 mb-md-0">
              <h1 className="display-5 fw-bold mb-3 text-success">
                Plan. Shop. Eat. Repeat.
              </h1>
              <p className="lead text-secondary mb-4">
                Healthy vegetarian meal planning made joyful — create menus and
                shopping lists that sync to your phone.
              </p>
              <div className="d-flex justify-content-center justify-content-md-start gap-3">
                <Link to={isLoggedIn ? "/profile" : "/login"}>
                  <button className="btn btn-primary btn-lg shadow-sm">
                    Start Planning
                  </button>
                </Link>
                <a
                  href="#how-it-works"
                  className="btn btn-outline-success btn-lg"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right column — image */}
            <div className="col-md-6 text-center">
              <img
                src={HeroImage} // or your hero image file path
                alt="Healthy vegetarian planning"
                className="img-fluid hero-img shadow rounded-4"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-5 bg-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-4 text-success">How Plantastic Works</h2>
          <p className="text-secondary mb-5">
            Plan your meals, shop smarter, and enjoy stress-free vegetarian
            cooking — one easy step at a time.
          </p>

          <div className="row g-4">
            {[
              "Check the Recipes even if you don’t have an account.",
              "Create an account and start planning!",
              "Save your own recipes — update them any time.",
              "Create your own meal plans for a week or two.",
              "See total ingredients for the whole plan.",
              "Add missing items to your shopping list.",
              "Edit your final shopping list and export it to your Notes.",
            ].map((step, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="how-step p-4 h-100 shadow-sm rounded-4 bg-light d-flex flex-column align-items-center">
                  <div
                    className={`step-circle mb-3 ${
                      index % 2 === 0 ? "bg-success" : "bg-warning"
                    }`}
                  >
                    <span className="fw-bold text-white fs-4">{index + 1}</span>
                  </div>
                  <p className="fw-medium text-dark">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
