import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
const API_URL = "http://localhost:5005";

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

  return (
    <div>
      <h1>Recipes Page</h1>
      <div className="recipe-container">
        {recipes &&
          recipes.map((recipe) => {
            return (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`}>
                <div className="recipe-card">
                  <h2>{recipe.name}</h2>
                  <img src={recipe.image} alt={recipe.name} />
                  <p>{recipe.duration} mins to cook</p>
                </div>
              </Link>
            );
          })}
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <Link to="/profile">
        <button>
          {currentUser ? "Go to my Profile!" : "Create My Own Meal Plan!"}
        </button>
      </Link>
    </div>
  );
};
