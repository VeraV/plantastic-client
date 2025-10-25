import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getIngredients, getInstructions } from "../helpers/stringFormats";

const API_URL = "http://localhost:5005";

export const CreateRecipePage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState(15);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const nav = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  async function handleCreateRecipe(e) {
    e.preventDefault();
    const newRecipe = {
      name,
      image,
      duration,
      ingredients: getIngredients(ingredients),
      instructions: getInstructions(instructions),
    };

    console.log(newRecipe);

    try {
      const { data } = await axios.post(`${API_URL}/api/recipes`, newRecipe, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      nav(`/recipes/${data._id}`);
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  return (
    <div className="recipe-page">
      <h1>New Recipe Page</h1>
      <form onSubmit={handleCreateRecipe}>
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
            placeholder={`Use notation:\n--> ingredient | quantity | unit\n--> new ingredient -- new line`}
            onChange={(e) => {
              setIngredients(e.target.value);
            }}
          />
        </label>
        <label>
          Instructions:
          <textarea
            value={instructions}
            placeholder={`New instruction -- new line.`}
            onChange={(e) => {
              setInstructions(e.target.value);
            }}
          />
        </label>
        <button type="submit">Save</button>
      </form>

      <Link to="/recipes">
        <button>Back to All Recipes</button>
      </Link>
      <div className="data-container"></div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};
