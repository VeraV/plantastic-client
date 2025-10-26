import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getIngredients, getInstructions } from "../helpers/stringFormats";
import EmblaCarousel from "../components/EmblaCarousel";
import { Ingredient } from "../components/Ingredient";
import { AuthContext } from "../context/AuthContext";

const API_URL = "http://localhost:5005";

export const CreatePlanPage = () => {
  const OPTIONS = { loop: true };
  const { currentUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const [recipesToChoose, setRecipesToChoose] = useState(null);
  const [recipesInPlan, setRecipesInPlan] = useState([]);
  const [totalIngredients, setTotalIngredients] = useState([]);

  const [newPlanTotalIngr, setNewPlanTotalIngr] = useState([]);

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

  function ingredientObject(string) {
    const ar = string.split("|").map((el) => el.trim());
    const name = ar[0][0].toUpperCase() + ar[0].substring(1).toLowerCase();
    const ingrObj = {
      name,
      quantity: ar[1] ? parseFloat(ar[1].match(/^\d+(\.\d+)?/)[0]) : 0,
      unit: ar[1] ? ar[1].match(/[a-zA-Z]+$/)[0] : "",
    };
    return ingrObj;
  }

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
      const ingrObj = ingredientObject(ingr);
      const foundIngredient = totalIngredients.filter((el) => {
        return Object.keys(el)[0] === ingrObj.name;
      })[0];
      //do we have this ingredient?
      if (foundIngredient) {
        const quanUnitArray = Object.values(foundIngredient)[0]
          .split("+")
          .map((e) => e.trim());
        let doExist = false;
        //looking for a proper unit
        quanUnitArray.forEach((quanUnit, ind) => {
          const quant = parseFloat(quanUnit.trim().match(/^\d+(\.\d+)?/)[0]);
          const unit =
            quant === 0 ? "" : quanUnit.trim().match(/[a-zA-Z]+$/)[0];
          if (unit === ingrObj.unit) {
            doExist = true;
            quanUnitArray[ind] = `${quant + ingrObj.quantity}${unit}`;
          }
        });
        if (!doExist) {
          quanUnitArray.push(`${ingrObj.quantity}${ingrObj.unit}`);
        }
        foundIngredient[ingrObj.name] = quanUnitArray.join(" + ");
      } else {
        const newIngredient = {};
        newIngredient[ingrObj.name] = `${ingrObj.quantity}${ingrObj.unit}`;
        totalIngredients.push(newIngredient);
      }
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
      console.log(data);
      nav("/profile");
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  return (
    <div>
      <h1>New Plan Page</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleCreatePlan}>
        <Link to="/profile">
          <button>Cancel</button>
        </Link>
        <button>Save</button>
        <hr />
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
        <section>
          <h2>Recipes:</h2>
          <div className="recipe-container">
            {recipesInPlan &&
              recipesInPlan.map((recipe) => {
                return (
                  <div className="recipe-card" key={recipe._id}>
                    <h4>{recipe.name}</h4>
                    <img src={recipe.image} alt={recipe.name} />
                    <p>{recipe.duration} mins to cook</p>
                    <button
                      onClick={(e) => {
                        handleRemoveFromPlan(e, recipe._id);
                      }}
                    >
                      Remove From Plan
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
        <section>
          <h2>Total ingredients:</h2>
          <ul className="ingredients">
            {newPlanTotalIngr &&
              newPlanTotalIngr.map((oneIngr, ind) => {
                //return <li key={ind}>{JSON.stringify(oneIngr)}</li>;
                return <Ingredient key={ind} ingredient={oneIngr} />;
              })}
          </ul>
        </section>
        <section>
          <h2>Shopping List:</h2>
        </section>
        <hr />
        {recipesToChoose && (
          <EmblaCarousel
            slides={recipesToChoose}
            options={OPTIONS}
            handleAddRecipe={handleAddRecipe}
          />
        )}
      </form>
    </div>
  );
};
