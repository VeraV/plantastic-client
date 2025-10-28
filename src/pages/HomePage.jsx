import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <>
      {/* Hero */}
      <section className="text-center py-5 bg-light">
        <div className="container">
          <h1 className="display-5 fw-bold mb-3">Plan. Shop. Eat. Repeat.</h1>
          <p className="lead text-secondary mb-4">
            Healthy vegetarian meal planning made joyful — create menus and
            shopping lists that sync to your phone.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to={isLoggedIn ? "/profile" : "/login"}>
              <button className="btn btn-primary btn-lg">Start Planning</button>
            </Link>
            <button className="btn btn-outline-success btn-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>
      <main className="container py-5">
        <p className="text-muted">
          This is where your meal planner and shopping list features will
          appear.
        </p>
      </main>
    </>
  );
};
