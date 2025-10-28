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
      <div className="container py-5">
        <div className="row g-4">
          {/* Left column – Meal Plans */}
          <div className="col-12 col-lg-8">
            <h2 className="fw-bold text-primary mb-4">My Meal Plans</h2>

            <div className="row g-3">
              {plans.map((onePlan) => (
                <div key={onePlan._id} className="col-12 col-md-6">
                  <Link
                    to={`/plan/${onePlan._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="card plan-card shadow-card p-4 h-100">
                      <h5 className="fw-bold mb-2">{onePlan.name}</h5>
                      <p className="text-secondary mb-0">
                        {onePlan.recipesNumber} recipes inside
                      </p>
                    </div>
                  </Link>
                </div>
              ))}

              {/* Add new plan */}

              <div className="col-12 col-md-6 ">
                <Link to="/plan/new" className="text-decoration-none">
                  <div
                    className="card add-plan-card shadow-card text-light bg-success d-flex align-items-center justify-content-center h-100 p-4 no-text-decoration"
                    style={{ cursor: "pointer" }}
                    onClick={() => alert("Create new plan")}
                  >
                    <div className="text-center">
                      <span className="display-6">＋</span>
                      <p className="fw-semibold mt-2 mb-0 ">Create New Plan</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Right column – Shopping List */}
          <div className="col-12 col-lg-4">
            <div
              className="card shadow-card p-4 position-sticky shopping-list"
              style={{ top: "2rem" }}
            >
              <h4 className="fw-bold text-success mb-3">Shopping List</h4>

              {totalShoppingList.length === 0 ? (
                <p className="text-secondary fst-italic">
                  Your shopping list is empty.
                </p>
              ) : (
                <ul className="list-unstyled">
                  {totalShoppingList.map((item, index) => (
                    <li
                      key={index}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      {!editItemMode[index] ? (
                        <Ingredient ingredient={item} />
                      ) : (
                        <div class="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            class="form-control flex-grow-1"
                            value={items[index]}
                            onChange={(e) => {
                              handleItemChange(index, e.target.value);
                            }}
                          />
                          <button
                            class="btn btn-outline-danger"
                            type="button"
                            onClick={cancelEditingItem}
                          >
                            <i class="bi bi-x-lg"></i>
                          </button>
                          <button
                            class="btn btn-primary"
                            onClick={() => {
                              handleItemSave(index);
                            }}
                            type="button"
                          >
                            <i class="bi bi-check-lg"></i>
                          </button>
                        </div>
                      )}

                      <div className="btn-group btn-group-sm">
                        {!editItemMode.includes(true) && (
                          <button
                            className="btn btn-outline-success"
                            onClick={() => {
                              clickEdit(index);
                            }}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                        )}
                        {!editItemMode.includes(true) && (
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                              handleRemoveItem(index);
                            }}
                          >
                            <i className="bi bi-eraser-fill"></i>
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Actions */}
              <div className="d-flex justify-content-between mt-3">
                {totalShoppingList.length > 0 &&
                  !editItemMode.includes(true) && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleClearAll}
                    >
                      <i className="bi bi-trash"></i> Clear All
                    </button>
                  )}

                {shopListIsChanged && !editItemMode.includes(true) && (
                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    onClick={saveTotalShoppingList}
                  >
                    Save
                  </button>
                )}
                {!editItemMode.includes(true) &&
                  totalShoppingList.length > 0 && (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={shareShoppingList}
                    >
                      Export <i className="bi bi-box-arrow-up-right"></i>
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
