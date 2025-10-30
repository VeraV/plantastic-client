import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  showIngredients,
  getIngredients,
  showInstructions,
  getInstructions,
} from "../helpers/stringFormats";
import { ConfirmModal } from "../components/ConfirmModal";
import CarrotSpinner from "../components/CarrotSpinner";
import { API_URL } from "../config/api.config";

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

  const [showConfirm, setShowConfirm] = useState(false);

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

    try {
      const image = e.target.image.files[0];
      const formData = new FormData();
      formData.append("imageUrl", image);
      formData.append("name", name);
      formData.append("duration", duration);
      formData.append("ingredients", getIngredients(ingredients));
      formData.append("instructions", getInstructions(instructions));

      const { data } = await axios.put(
        `${API_URL}/api/recipes/${recipeId}`,
        formData,
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

  const handleShowConfirm = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteRecipe();
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (!name) {
    return <CarrotSpinner />;
  }

  return (
    <div className="container py-5">
      <div
        className="card shadow-card p-4 p-md-5 mx-auto"
        style={{ maxWidth: "900px" }}
      >
        <h1 className="fw-bold text-primary text-center mb-4">Update Recipe</h1>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <form onSubmit={handleUpdateRecipe} className="recipe-form">
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
              src={image}
              alt={name}
              className="img-preview rounded shadow-sm"
            />
            {/* File upload input */}
            <label className="form-label fw-semibold" htmlFor="image">
              Change Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              className="form-control form-control-sm"
              onChange={(e) => {
                setImage(URL.createObjectURL(e.target.files[0]));
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
              placeholder={`Use notation:\n--> ingredient | quantity | unit\n--> new ingredient -- new line`}
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
              placeholder={`New instruction -- new line.`}
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
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleShowConfirm}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
      {/* Confirmation Modal */}
      <ConfirmModal
        show={showConfirm}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />
    </div>
  );
};
