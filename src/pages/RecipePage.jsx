import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CookingInstructions } from "../components/CookingInstructions";
import { Ingredient } from "../components/Ingredient";
import { AuthContext } from "../context/AuthContext";
import CarrotSpinner from "../components/CarrotSpinner";
import { API_URL } from "../config/api.config";

export const RecipePage = () => {
  const { recipeId } = useParams();
  const [theRecipe, setTheRecipe] = useState();
  const [errorMessage, setErrorMessage] = useState();

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    async function getTheRecipe() {
      try {
        const { data } = await axios.get(`${API_URL}/api/recipes/${recipeId}`);
        setTheRecipe(data);
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }
    getTheRecipe();
  }, [recipeId]);

  if (!theRecipe) {
    return <CarrotSpinner />;
  }

  return (
    <div className="container py-5">
      <div
        className="recipe-page card shadow-card p-4 p-md-5 mx-auto"
        style={{ maxWidth: "900px" }}
      >
        <h1 className="fw-bold text-center text-primary mb-4">
          {theRecipe.name}
        </h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <p className="card-text text-center">
          <small className="text-body-secondary">
            ⏱ {theRecipe.duration} mins
          </small>
        </p>
        <img
          src={theRecipe.image}
          alt={theRecipe.name}
          className="img-fluid rounded mb-4 recipe-img"
        />

        {/* Ingredients */}
        <div className="container my-2">
          <div className="row align-items-top">
            <div className="col-12 col-md-6 col-40">
              <h4 className="fw-semibold text-success mb-5">Ingredients</h4>
              {theRecipe.ingredients.map((item, index) => (
                <Ingredient key={index} ingredient={item} className="mb-1" />
              ))}
            </div>

            {/* Instructions */}
            <div className="col-12 col-md-6 col-60">
              <h4 className="fw-semibold text-success mb-5">Instructions</h4>
              <div className="ms-3 instructions-section">
                <CookingInstructions instructions={theRecipe.instructions} />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Link to="/recipes" className="btn btn-outline-success">
            ← Back to All Recipes
          </Link>
          {currentUser && (
            <Link to={`/recipes/${theRecipe._id}/edit`}>
              <button className="btn btn-primary">Edit Recipe</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
