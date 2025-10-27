import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showIngredients, showInstructions } from "../helpers/stringFormats";
import { addToTotalShoppingList } from "../helpers/listItems";
import { Ingredient } from "../components/Ingredient";
import { AuthContext } from "../context/AuthContext";

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
    return <span className="loader"></span>;
  }

  return (
    <>
      <h2>Plan Page</h2>
      <h3>{plan.name}</h3>
      {plan.recipes.map((oneRecipe) => {
        return (
          <div key={oneRecipe._id} className="recipe-card">
            <h6>{oneRecipe.name}</h6>
            <img src={oneRecipe.image} alt={oneRecipe.name} />
            <p>Time to cook: {oneRecipe.duration} mins</p>
            <p>Ingredients: {showIngredients(oneRecipe.ingredients)}</p>
            <p>Instructions: {showInstructions(oneRecipe.instructions)}</p>
          </div>
        );
      })}
      <section>
        <h2>Total ingredients:</h2>
        <ul className="ingredients">
          {plan.totalIngredients.map((oneIngr, ind) => {
            return (
              <li key={ind}>
                <Ingredient ingredient={oneIngr} />
                <button
                  onClick={() => {
                    handleAddToShoppingList(oneIngr);
                  }}
                >
                  To Shopping List
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section>
        <h2>Shopping List:</h2>
        <ul>
          {shoppingList &&
            shoppingList.items.map((item, ind) => {
              return (
                <li key={ind}>
                  <Ingredient ingredient={item} />
                  <button
                    onClick={() => {
                      handleRemoveItemFromShop(ind);
                    }}
                  >
                    No need
                  </button>
                </li>
              );
            })}
        </ul>
      </section>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  );
};
