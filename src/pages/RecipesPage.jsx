import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import CarrotSpinner from "../components/CarrotSpinner";
import { API_URL } from "../config/api.config";

export const RecipesPage = () => {
  const [recipes, setRecipes] = useState();
  const [errorMessage, setErrorMessage] = useState(undefined);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    async function loadAllRecipes() {
      try {
        const { data } = await axios.get(`${API_URL}/api/recipes`);
        setRecipes(data);
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }
    loadAllRecipes();
  }, []);

  if (!recipes) return <CarrotSpinner />;

  return (
    <div>
      <div className="container py-5 text-center recipes-page">
        <h1 className="mb-5 fw-bold text-primary">Recipes</h1>
        <Link to="/profile" className="btn btn-primary mb-5">
          {currentUser ? "Go to my Profile!" : "Create My Own Meal Plan!"}
        </Link>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="row g-2">
          {recipes &&
            recipes.map((recipe) => (
              <div
                key={recipe._id}
                className="col-12 col-md-6 col-lg-4 recipe-card"
              >
                <div className="card recipe-card h-50 shadow-card">
                  <img
                    src={recipe.image}
                    className="card-img-top"
                    alt={recipe.name}
                  />
                  <div className="card-body color-light d-flex flex-column text-center">
                    <h5 className="card-title fw-bold">{recipe.name}</h5>
                    <p className="card-text text-secondary">
                      ⏱ {recipe.duration} mins
                    </p>
                    <div className="mt-auto d-flex gap-2">
                      <Link
                        to={`/recipes/${recipe._id}`}
                        className="btn btn-outline-primary flex-grow-1"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
