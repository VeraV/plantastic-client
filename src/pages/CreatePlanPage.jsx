import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  addItemToList,
  addToTotalShoppingList,
  ingredientObject,
} from "../helpers/listItems";
import EmblaCarousel from "../components/EmblaCarousel";
import { Ingredient } from "../components/Ingredient";
import { AuthContext } from "../context/AuthContext";
import { API_URL } from "../config/api.config";

export const CreatePlanPage = () => {
  const OPTIONS = { loop: true };
  const {
    currentUser,
    totalShoppingList,
    setTotalShoppingList,
    setShopListIsChanged,
  } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const [recipesToChoose, setRecipesToChoose] = useState(null);
  const [recipesInPlan, setRecipesInPlan] = useState([]);
  const [totalIngredients, setTotalIngredients] = useState([]);

  const [newPlanTotalIngr, setNewPlanTotalIngr] = useState([]);
  const [shoppingItems, setShoppingItems] = useState([]);

  const nav = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    async function loadAllRecipes() {
      try {
        const { data } = await axios.get(`${API_URL}/api/recipes`);
        setRecipesToChoose(data);
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }
    loadAllRecipes();
  }, []);

  //DB format: ["potato|3pieces+4kg","salt"]
  //Here:      [{potato: '3pieces+4kg'}, {salt: 0}]
  function refreshTotalIngredients() {
    setNewPlanTotalIngr(
      totalIngredients.map((ingr) => {
        return `${Object.keys(ingr)[0]}${
          Object.values(ingr)[0] == 0 ? "" : " | " + Object.values(ingr)[0]
        }`;
      })
    );
  }

  //totalIngredience: [{'potato': ['2kg', 3pieces]}]
  function addIngredientsToTotal(theRecipe) {
    theRecipe.ingredients.forEach((ingr) => {
      addItemToList(ingr, totalIngredients, setTotalIngredients);
    });
    refreshTotalIngredients();
  }

  function removeIngredientsFromTotal(theRecipe) {
    theRecipe.ingredients.forEach((ingr) => {
      const ingrObj = ingredientObject(ingr);
      const foundIngredient = totalIngredients.filter((el) => {
        return Object.keys(el)[0] === ingrObj.name;
      })[0];

      const quanUnitArray = Object.values(foundIngredient)[0]
        .split("+")
        .map((e) => e.trim());

      let indToRemove = -1;

      //looking for a proper unit
      quanUnitArray.forEach((quanUnit, ind) => {
        const quant = parseFloat(quanUnit.trim().match(/^\d+(\.\d+)?/)[0]);
        const unit = quant === 0 ? "" : quanUnit.trim().match(/[a-zA-Z]+$/)[0];
        if (unit === ingrObj.unit) {
          if (quant - ingrObj.quantity === 0 && quant !== 0) {
            indToRemove = ind;
          } else {
            quanUnitArray[ind] = `${quant - ingrObj.quantity}${unit}`;
          }
        }
      });

      if (indToRemove > -1) {
        if (quanUnitArray.length === 1) {
          totalIngredients.splice(totalIngredients.indexOf(foundIngredient), 1);
        }
        quanUnitArray.splice(indToRemove, 1);
      } else {
        foundIngredient[ingrObj.name] = quanUnitArray.join(" + ");
      }
    });
    refreshTotalIngredients();
  }

  function handleAddRecipe(e, recipeId) {
    e.preventDefault();
    const foundRecipe = recipesToChoose.filter(
      (recipe) => recipe._id === recipeId
    )[0];
    setRecipesToChoose(
      recipesToChoose.filter((recipe) => recipe._id !== recipeId)
    );
    setRecipesInPlan([...recipesInPlan, foundRecipe]);

    addIngredientsToTotal(foundRecipe);
  }

  function handleRemoveFromPlan(e, recipeId) {
    e.preventDefault();
    const foundRecipe = recipesInPlan.filter(
      (recipe) => recipe._id === recipeId
    )[0];
    const filteredRecipesInPlan = recipesInPlan.filter(
      (recipe) => recipe._id !== recipeId
    );
    setRecipesInPlan(filteredRecipesInPlan);
    setRecipesToChoose([...recipesToChoose, foundRecipe]);

    if (filteredRecipesInPlan.length === 0) {
      setTotalIngredients([]);
      setNewPlanTotalIngr([]);
      return;
    }
    removeIngredientsFromTotal(foundRecipe);
  }

  async function handleCreatePlan(e) {
    e.preventDefault();
    if (name.length === 0) {
      setErrorMessage("Please, enter a name for a new meal plan.");
      return;
    }

    const newPlan = {
      name,
      userId: currentUser._id,
      recipes: recipesInPlan.map((r) => r._id),
      totalIngredients: newPlanTotalIngr,
    };

    try {
      const { data } = await axios.post(`${API_URL}/api/plans`, newPlan, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      //patch to shopping list (only need to update "items", ShoppingListId we have in data.shoppingListId)
      const res = await axios.patch(
        `${API_URL}/api/shopping-list/${data.shoppingListId}`,
        { items: shoppingItems },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      //add all from shopping list to Total Shopping List
      shoppingItems.forEach((item) => {
        addToTotalShoppingList(item, totalShoppingList, setTotalShoppingList);
        setShopListIsChanged(true);
      });
      nav("/profile");
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  function handleAddToShoppingList(ingredient) {
    if (shoppingItems.includes(ingredient)) return;
    setShoppingItems([...shoppingItems, ingredient]);
  }

  function handleRemoveItemFromShop(indexToRemove) {
    setShoppingItems(shoppingItems.filter((e, ind) => ind !== indexToRemove));
  }

  return (
    <div>
      <div className="container py-5">
        {/* HEADER AREA */}
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <input
            type="text"
            className="form-control plan-name-input flex-grow-1"
            placeholder="Name your meal plan..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <div className="d-flex gap-2">
            <Link to="/profile">
              <button className="btn btn-outline-secondary">← Back</button>
            </Link>
            <button className="btn btn-primary" onClick={handleCreatePlan}>
              💾 Save Plan
            </button>
          </div>
        </div>

        {/* --- TOP SECTION --- */}
        <div className="top-section mb-5">
          <div className="row g-4">
            {/* Picked Recipes */}
            <div className="col-12 col-lg-7">
              <div className="card shadow-card p-4 h-100">
                <h4 className="fw-bold text-primary mb-3">Picked Recipes</h4>
                <div className="d-flex flex-wrap gap-3">
                  {recipesInPlan &&
                    recipesInPlan.map((recipe) => (
                      <div
                        key={recipe._id}
                        className="recipe-mini-card d-flex align-items-center p-2 justify-content-between"
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="recipe-mini-img me-2"
                          />
                          <div>
                            <h6 className="mb-1 fw-semibold">{recipe.name}</h6>
                            <small className="text-secondary">
                              {recipe.duration} mins to cook
                            </small>
                          </div>
                        </div>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => {
                            handleRemoveFromPlan(e, recipe._id);
                          }}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Ingredients + Shopping List */}
            <div className="col-12 col-lg-5 d-flex flex-column gap-4">
              {/* Ingredients */}
              <div className="card shadow-card p-4 flex-grow-1">
                <h5 className="fw-bold text-success mb-3">Ingredients</h5>
                <ul className="ingredients-list mb-0">
                  {newPlanTotalIngr &&
                    newPlanTotalIngr.map((item, i) => (
                      <li key={i} className="mb-2">
                        <div className="d-flex align-items-center justify-content-between gap-2">
                          <Ingredient ingredient={item} />
                          <button
                            type="button"
                            className="btn btn-outline-success btn-small"
                            onClick={() => {
                              handleAddToShoppingList(item);
                            }}
                          >
                            <i className="bi bi-bag-plus-fill"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Shopping List */}
              <div className="card shadow-card p-4 flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-success mb-0">Shopping List</h5>
                </div>
                {shoppingItems && (
                  <ul className="list-unstyled mb-3">
                    {shoppingItems.map((item, i) => (
                      <li
                        key={i}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <span>{item}</span>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              handleRemoveItemFromShop(i);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION (Carousel) --- */}
        <div className="bottom-section">
          <h4 className="fw-bold text-primary mb-3">Add More Recipes</h4>
          {recipesToChoose && (
            <EmblaCarousel
              slides={recipesToChoose}
              options={OPTIONS}
              handleAddRecipe={handleAddRecipe}
            />
          )}
        </div>
      </div>
    </div>
  );
};
