import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CookingInstructions } from "../components/CookingInstructions";
import { Ingredient } from "../components/Ingredient";
import { AuthContext } from "../context/AuthContext";
const API_URL = "http://localhost:5005";

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
    return <span className="loader"></span>;
  }

  return (
    <div className="recipe-page">
      <h1>Recipe Page</h1>
      <h2>{theRecipe.name}</h2>
      <p>
        <img src={theRecipe.image} alt={theRecipe.name} />
      </p>
      <p>Time to Cook: {theRecipe.duration} mins</p>
      <div className="recipe-details-container">
        <section className="ingredient-section">
          <ul className="ingredients">
            {theRecipe.ingredients.map((oneIngr, ind) => {
              return (
                <li key={ind}>
                  <Ingredient ingredient={oneIngr} />
                </li>
              );
            })}
          </ul>
        </section>
        <section className="instructions-section">
          <CookingInstructions instructions={theRecipe.instructions} />
        </section>
      </div>
      {currentUser && (
        <Link to={`/recipes/${theRecipe._id}/edit`}>
          <button>Edit</button>
        </Link>
      )}
      <Link to="/recipes">
        <button>Back to All Recipes</button>
      </Link>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
