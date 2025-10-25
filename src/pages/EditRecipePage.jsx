import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  showIngredients,
  getIngredients,
  showInstructions,
  getInstructions,
} from "../helpers/stringFormats";
const API_URL = "http://localhost:5005";

export const EditRecipePage = () => {
  const { recipeId } = useParams();
  const [errorMessage, setErrorMessage] = useState();
  const nav = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState(15);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    async function getTheRecipe() {
      try {
        const { data } = await axios.get(`${API_URL}/api/recipes/${recipeId}`);
        setName(data.name);
        setImage(data.image);
        setDuration(data.duration);
        setIngredients(showIngredients(data.ingredients));
        setInstructions(showInstructions(data.instructions));
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }
    getTheRecipe();
  }, [recipeId]);

  async function handleUpdateRecipe(e) {
    e.preventDefault();

    const updatedRecipe = {
      name,
      image,
      duration,
      ingredients: getIngredients(ingredients),
      instructions: getInstructions(instructions),
    };

    try {
      const { data } = await axios.put(
        `${API_URL}/api/recipes/${recipeId}`,
        updatedRecipe,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      nav(`/recipes/${recipeId}`);
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  async function handleDeleteRecipe() {
    try {
      const { data } = await axios.delete(
        `${API_URL}/api/recipes/${recipeId}`,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      nav(`/recipes`);
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  if (!name) {
    return <span className="loader"></span>;
  }
  return (
    <div className="recipe-page">
      <h1>Edit Recipe Page</h1>
      <form onSubmit={handleUpdateRecipe}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </label>
        <label>
          Image:
          <input
            type="text"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
            }}
          />
        </label>
        <label>
          Time to cook:
          <input
            type="number"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
            }}
          />
          mins
        </label>
        <label>
          Ingredients:
          <textarea
            value={ingredients}
            onChange={(e) => {
              setIngredients(e.target.value);
            }}
          />
        </label>
        <label>
          Instructions:
          <textarea
            value={instructions}
            onChange={(e) => {
              setInstructions(e.target.value);
            }}
          />
        </label>
        <button type="submit">Save</button>
        <button type="button" onClick={handleDeleteRecipe}>
          Delete
        </button>
      </form>

      <Link to="/recipes">
        <button>Back to All Recipes</button>
      </Link>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
