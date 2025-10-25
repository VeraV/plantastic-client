import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showIngredients, showInstructions } from "../helpers/stringFormats";

export const PlanPage = () => {
  const API_URL = "http://localhost:5005";
  const storedToken = localStorage.getItem("authToken");
  const { planId } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const [plan, setPlan] = useState();

  useEffect(() => {
    async function getPlanInfo() {
      console.log(planId);
      try {
        const { data } = await axios.get(`${API_URL}/api/plans/${planId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        console.log(data);
        setPlan(data);
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }

    getPlanInfo();
  }, [planId]);

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
        <p></p>
      </section>
      <section>
        <h2>Shopping List:</h2>
      </section>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  );
};
