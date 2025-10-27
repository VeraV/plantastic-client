import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";
import { Ingredient } from "../components/Ingredient";
//import { ingredientObject } from "../helpers/listItems";

export const ProfilePage = () => {
  const API_URL = "http://localhost:5005";
  const storedToken = localStorage.getItem("authToken");
  const {
    currentUser,
    totalShoppingList,
    setTotalShoppingList,
    setShopListIsChanged,
    shopListIsChanged,
    totalShoppingListId,
  } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState();
  const [plans, setPlans] = useState(null);
  const [editItemMode, setEditItemMode] = useState(
    new Array(totalShoppingList.length).fill(false)
  );
  const [items, setItems] = useState(totalShoppingList);

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
      } catch (error) {
        setErrorMessage(error.response.data.errorMessage);
      }
    }
    loadAllUserProfileData();
  }, []);

  async function saveTotalShoppingList() {
    try {
      const { data } = await axios.patch(
        `${API_URL}/api/shopping-list/${totalShoppingListId}`,
        { items: totalShoppingList },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      setShopListIsChanged(false);
    } catch (error) {
      setErrorMessage(error.response.data.errorMessage);
    }
  }

  function handleRemoveItem(indexToRemove) {
    setTotalShoppingList(
      totalShoppingList.filter((e, ind) => ind !== indexToRemove)
    );
    setItems(items.filter((e, ind) => ind !== indexToRemove));
    setEditItemMode(editItemMode.filter((e, ind) => ind !== indexToRemove));

    setShopListIsChanged(true);
  }

  function handleItemSave(index) {
    setTotalShoppingList(
      totalShoppingList.map((e, ind) => {
        if (ind === index) return items[index];
        else return e;
      })
    );
    setEditItemMode(editItemMode.fill(false));
    setShopListIsChanged(true);
  }

  function cancelEditingItem() {
    setItems(totalShoppingList);
    setEditItemMode(editItemMode.fill(false));
  }

  function handleItemChange(index, newValue) {
    setItems(
      items.map((e, ind) => {
        if (ind === index) return newValue;
        else return e;
      })
    );
  }

  function clickEdit(index) {
    setEditItemMode(editItemMode.map((e, ind) => ind === index));
  }

  function handleClearAll() {
    setTotalShoppingList([]);
    setItems([]);
    setShopListIsChanged(true);
  }

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
          {totalShoppingList && (
            <div>
              <ul className="ingredients">
                {totalShoppingList.map((item, ind) => {
                  return (
                    <li key={ind}>
                      {!editItemMode[ind] ? (
                        <Ingredient ingredient={item} />
                      ) : (
                        <div>
                          <input
                            value={items[ind]}
                            onChange={(e) => {
                              handleItemChange(ind, e.target.value);
                            }}
                          />
                          <button type="button" onClick={cancelEditingItem}>
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              handleItemSave(ind);
                            }}
                          >
                            Update
                          </button>
                        </div>
                      )}

                      {!editItemMode.includes(true) && (
                        <button
                          type="button"
                          onClick={() => {
                            clickEdit(ind);
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {!editItemMode.includes(true) && (
                        <button
                          type="button"
                          onClick={() => {
                            handleRemoveItem(ind);
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
              {totalShoppingList.length > 0 && (
                <button type="button" onClick={handleClearAll}>
                  Clear All
                </button>
              )}
            </div>
          )}
          {shopListIsChanged && !editItemMode.includes(true) && (
            <button type="button" onClick={saveTotalShoppingList}>
              Save
            </button>
          )}
          {!editItemMode.includes(true) && totalShoppingList.length > 0 && (
            <button onClick={shareShoppingList}>Export</button>
          )}
        </section>
      </main>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </>
  );
};
