import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Ingredient } from "../components/Ingredient";

export const ProfilePage = () => {
  const API_URL = "http://localhost:5005";
  const storedToken = localStorage.getItem("authToken");
  const { currentUser } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState();
  const [plans, setPlans] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  /********** Export **************/
  async function shareShoppingList() {
    const shoppingItems = ["Milk", "Eggs", "Bananas"];
    const text = shoppingItems.join("\n"); // each item on its own line

    if (navigator.share) {
      try {
        console.log("Share sheet opened");
        await navigator.share({
          text,
        });
        console.log("After!");
      } catch (err) {
        console.error("Share failed:", err);
        // fallback -> download file
        downloadTextFile("shopping-list.txt", text);
      }
    } else {
      // Fallback: download .txt (user can open it on phone or copy)
      downloadTextFile("shopping-list.txt", text);
    }
    /**********Export End**************/
  }

  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  useEffect(() => {
    async function loadAllUserProfileData() {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/plans/user/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
        setPlans(data);
        const res = await axios.get(
          `${API_URL}/api/shopping-list/user/${currentUser._id}`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
        setShoppingList(res.data);
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }
    loadAllUserProfileData();
  }, []);

  if (!plans) {
    return <span className="loader"></span>;
  }

  return (
    <>
      <h1>Profile Page</h1>
      <main className="profile-page-content">
        <section className="plans-container">
          {plans.map((onePlan) => {
            return (
              <Link to={`/plan/${onePlan._id}`} key={onePlan._id}>
                <div className="plan">
                  <h4>{onePlan.name}</h4>
                  <p>{onePlan.recipesNumber} recipes</p>
                </div>
              </Link>
            );
          })}
          <Link to="/plan/new">
            <div className="plan">
              <h4>+ Add New Plan</h4>
            </div>
          </Link>
        </section>
        <section className="total-shopping-list">
          <p>Shopping List</p>
          {shoppingList && (
            <ul className="ingredients">
              {shoppingList.items.map((item, ind) => {
                return (
                  <li key={ind}>
                    <Ingredient ingredient={item} />
                  </li>
                );
              })}
            </ul>
          )}
          <button onClick={shareShoppingList}>Export</button>
        </section>
      </main>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  );
};
