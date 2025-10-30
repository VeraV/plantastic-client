import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { showIngredients, showInstructions } from "../helpers/stringFormats";
import { addToTotalShoppingList } from "../helpers/listItems";
import { Ingredient } from "../components/Ingredient";
import { AuthContext } from "../context/AuthContext";
import CarrotSpinner from "../components/CarrotSpinner";

export const PlanPage = (props) => {
  const API_URL = "http://localhost:5005";
  const storedToken = localStorage.getItem("authToken");
  const { planId } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const [plan, setPlan] = useState();
  const [shoppingList, setShoppingList] = useState();

  const { totalShoppingList, setTotalShoppingList, setShopListIsChanged } =
    useContext(AuthContext);

  useEffect(() => {
    async function getPlanInfo() {
      try {
        const { data } = await axios.get(`${API_URL}/api/plans/${planId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setPlan(data);

        const res = await axios.get(
          `${API_URL}/api/shopping-list/plan/${planId}`,
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        setShoppingList(res.data);
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }

    getPlanInfo();
  }, [planId]);

  async function handleAddToShoppingList(itemToAdd) {
    if (shoppingList.items.includes(itemToAdd)) return;

    setShoppingList({
      ...shoppingList,
      items: [...shoppingList.items, itemToAdd],
    });

    //update db
    try {
      const { data } = await axios.patch(
        `${API_URL}/api/shopping-list/${shoppingList._id}`,
        { items: [...shoppingList.items, itemToAdd] },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      console.log(data);

      //console.log(strItem);
      addToTotalShoppingList(
        itemToAdd,
        totalShoppingList,
        setTotalShoppingList
      );
      setShopListIsChanged(true);
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  async function handleRemoveItemFromShop(indexToRemove) {
    setShoppingList({
      ...shoppingList,
      items: shoppingList.items.filter((e, i) => i !== indexToRemove),
    });
    //update db
    try {
      const { data } = await axios.patch(
        `${API_URL}/api/shopping-list/${shoppingList._id}`,
        { items: shoppingList.items.filter((e, i) => i !== indexToRemove) },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      console.log(data);
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  if (!plan) {
    return <CarrotSpinner />;
  }

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold text-primary">{plan.name}</h2>
        <Link to="/profile" className="btn btn-outline-success">
          ← Back to Dashboard
        </Link>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* RECIPES SECTION */}
      <div className="recipes-section mb-5">
        <h4 className="fw-bold text-success mb-4">Recipes in this Plan</h4>
        <div className="row g-4">
          {plan.recipes.map((recipe) => (
            <div key={recipe._id} className="col-12 col-md-6">
              <div className="card recipe-card p-3 shadow-card h-100">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="recipe-plan-img me-3"
                  />
                  <div>
                    <h5 className="fw-bold mb-1">{recipe.name}</h5>
                    <small className="text-secondary">
                      ⏱ {recipe.duration} mins
                    </small>
                  </div>
                </div>

                <div>
                  <h6 className="fw-semibold text-primary mb-2">Ingredients</h6>
                  <ul className="list-unstyled ingredients-list mb-3">
                    {recipe.ingredients.map((item, i) => (
                      <li key={i}>
                        <Ingredient ingredient={item} />
                      </li>
                    ))}
                  </ul>

                  <h6 className="fw-semibold text-primary mb-2">
                    Instructions
                  </h6>
                  <ol className="instructions-list mb-0">
                    {recipe.instructions.split("|").map((step, i) => (
                      <li key={i}>{step.trim()}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY SECTION */}
      <div className="summary-section row g-4">
        {/* TOTAL INGREDIENTS */}
        <div className="col-12 col-lg-6">
          <div className="card p-4 shadow-card h-100">
            <h5 className="fw-bold text-success mb-3">Total Ingredients</h5>
            <ul className="list-unstyled mb-0">
              {plan.totalIngredients.map((item, i) => (
                <li
                  key={i}
                  className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1"
                >
                  <Ingredient ingredient={item} />
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      handleAddToShoppingList(item);
                    }}
                  >
                    <i className="bi bi-bag-plus-fill"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SHOPPING LIST */}
        <div className="col-12 col-lg-6">
          <div className="card p-4 shadow-card h-100">
            <h5 className="fw-bold text-success mb-3">Shopping List</h5>
            {shoppingList && shoppingList.items.length === 0 ? (
              <p className="text-muted fst-italic">No items yet.</p>
            ) : (
              <ul className="list-unstyled mb-0">
                {shoppingList &&
                  shoppingList.items.map((item, i) => (
                    <li
                      key={i}
                      className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-1"
                    >
                      <Ingredient ingredient={item} />
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          handleRemoveItemFromShop(i);
                        }}
                      >
                        No Need
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
