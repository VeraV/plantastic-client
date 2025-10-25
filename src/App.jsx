import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Navbar } from "./components/Navbar";
import { RouteProtector } from "./components/RouteProtector";
import { RecipesPage } from "./pages/RecipesPage";
import { RecipePage } from "./pages/RecipePage";
import { EditRecipePage } from "./pages/EditRecipePage";
import { CreateRecipePage } from "./pages/CreateRecipePage";
import IsPrivate from "./components/IsPrivate";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/recipes" element={<RecipesPage />}></Route>
        <Route path="/recipes/:recipeId" element={<RecipePage />}></Route>
        <Route
          path="/recipes/:recipeId/edit"
          element={
            <IsPrivate>
              <EditRecipePage />
            </IsPrivate>
          }
        ></Route>
        <Route
          path="/recipes/new"
          element={
            <IsPrivate>
              <CreateRecipePage />
            </IsPrivate>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <RouteProtector>
              <ProfilePage />
            </RouteProtector>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
