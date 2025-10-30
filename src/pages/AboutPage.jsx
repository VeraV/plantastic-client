import React from "react";
import veraImg from "../assets/vera.jpg";

const AboutPage = () => {
  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          {/* LEFT COLUMN */}
          <div className="col-md-6 mb-4 mb-md-0">
            <h1 className="display-6 fw-bold text-success mb-3">
              About Plantastic 🥕
            </h1>
            <p className="lead text-secondary">
              <strong>Plantastic</strong> is a joyful, easy-to-use vegetarian
              meal planner that helps you create recipes, build weekly meal
              plans, and generate smart shopping lists — all in one place.
            </p>
            <p>
              I built this project as a personal exploration of React, Node.js,
              and full-stack development. It’s powered by a custom server and a
              MongoDB database, with a focus on clean design and simplicity.
            </p>

            <div className="mt-4">
              <h5 className="fw-semibold mb-2">Tech Stack</h5>
              <ul className="list-inline text-secondary">
                <li className="list-inline-item me-3">⚛️ React</li>
                <li className="list-inline-item me-3">🖥️ Node.js / Express</li>
                <li className="list-inline-item me-3">🍃 MongoDB</li>
                <li className="list-inline-item me-3">🎨 Bootstrap</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-6 text-center d-flex flex-column align-items-center">
            <img
              src={veraImg}
              alt="Plantastic Illustration"
              className="img-fluid rounded-4 shadow-sm mb-4"
              style={{ maxWidth: "380px" }}
            />

            <div>
              <h5 className="fw-semibold mb-2">About Me</h5>
              <p className="text-secondary mb-3">
                Hi! I’m Vera Fileyeva, a web developer passionate about clean
                design and user-friendly tools that make daily life easier.
              </p>

              <div className="d-flex gap-3 justify-content-center">
                <a
                  href="https://www.linkedin.com/in/vera-veramei-5757b257/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-success"
                >
                  <i className="bi bi-linkedin me-1"></i> LinkedIn
                </a>
                <a
                  href="https://github.com/VeraV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-dark"
                >
                  <i className="bi bi-github me-1"></i> GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
