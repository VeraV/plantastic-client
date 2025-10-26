import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showIngredients, showInstructions } from "../helpers/stringFormats";
import { Ingredient } from "../components/Ingredient";

export const PlanPage = () => {
  const API_URL = "http://localhost:5005";
  const storedToken = localStorage.getItem("authToken");
  const { planId } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const [plan, setPlan] = useState();
  const [shoppingList, setShoppingList] = useState();

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

  

  function addQuantity(oldQuanUnitStr, quantityToAdd, unitToAdd) {
    const quantUnitArray = oldQuanUnitStr.split("+").map((e) => {
      e.trim();
      return [
        parseFloat(e.trim().match(/^\d+(\.\d+)?/)[0]) /*quantity*/,
        e.trim().match(/[a-zA-Z]+$/)[0] /*unit*/,
      ];
    }); //all quantity-unit we already have

    console.log(quantUnitArray);
  }

  function showTotalIngredients() {
    const totalIngredients = {};
    plan.recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        const ingr = ingredientObject(ingredient);
        if (!Object.keys(totalIngredients).includes(ingr.name)) {
          totalIngredients[ingr.name] = `${ingr.quantity}${ingr.unit}`;
        } else {
          const newQuanUnit = addQuantity(
            totalIngredients[ingr.name],
            ingr.quantity,
            ingr.unit
          );
        }
      });
    });
    console.log(totalIngredients);
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
                </li>
              );
            })}
        </ul>
      </section>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  );
};
