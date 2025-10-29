import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getIngredients, getInstructions } from "../helpers/stringFormats";

const API_URL = "http://localhost:5005";

export const CreateRecipePage = () => {
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(15);
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const nav = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  async function handleCreateRecipe(e) {
    e.preventDefault();

    try {
      const image = e.target.image.files[0];
      const formData = new FormData();
      formData.append("imageUrl", image);
      formData.append("name", name);
      formData.append("duration", duration);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);

      const { data } = await axios.post(`${API_URL}/api/recipes`, formData, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      nav(`/recipes/${data._id}`);
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  return (
    <div className="container py-5">
      <div
        className="card shadow-card p-4 p-md-5 mx-auto"
        style={{ maxWidth: "900px" }}
      >
        <h1 className="fw-bold text-primary text-center mb-4">
          Create a New Recipe
        </h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleCreateRecipe} className="recipe-form">
          {/* Recipe Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="name">
              Recipe Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              placeholder="E.g., Avocado Toast"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </div>

          {/* Image URL */}
          <div className="d-flex align-items-center gap-3 mb-3">
            {/* Image preview */}
            <img
              src={imagePreview}
              alt={name}
              className="img-preview rounded shadow-sm"
            />
            <label className="form-label fw-semibold" htmlFor="image">
              Image URL
            </label>
            <input
              id="image"
              name="image"
              type="file"
              className="form-control form-control-sm"
              onChange={(e) => {
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="duration">
              Time to cook
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              className="form-control"
              placeholder="15"
              value={duration}
              onChange={(e) => {
                setDuration(e.target.value);
              }}
            />{" "}
            mins
          </div>

          {/* Ingredients */}
          <div className="mb-3">
            <label className="form-label fw-semibold" htmlFor="ingredients">
              Ingredients
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              rows="4"
              className="form-control"
              placeholder={`Use notation:\n--> ingredient | quantityUnit\n--> new ingredient — new line`}
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
              }}
              required
            />
          </div>

          {/* Instructions */}
          <div className="mb-4">
            <label className="form-label fw-semibold" htmlFor="instructions">
              Instructions
            </label>
            <textarea
              id="instructions"
              name="instructions"
              rows="6"
              className="form-control"
              placeholder={`New instruction --> new line.`}
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
              }}
              required
            />
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <Link to="/recipes">
              <button type="button" className="btn btn-outline-success">
                ← Back
              </button>
            </Link>
            <button type="submit" className="btn btn-primary">
              Save Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
