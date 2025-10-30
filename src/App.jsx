import { useState } from "react";
import "./App.css";
import "./embla.css";
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
import { PlanPage } from "./pages/PlanPage";
import { CreatePlanPage } from "./pages/CreatePlanPage";
import { PlantasticOutlet } from "./components/PlantasticOutlet";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route
          path="/"
          element={
            <PlantasticOutlet>
              <HomePage />
            </PlantasticOutlet>
          }
        ></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route
          path="/recipes"
          element={
            <PlantasticOutlet>
              <RecipesPage />
            </PlantasticOutlet>
          }
        ></Route>
        <Route
          path="/recipes/:recipeId"
          element={
            <PlantasticOutlet>
              <RecipePage />
            </PlantasticOutlet>
          }
        ></Route>
        <Route
          path="/recipes/:recipeId/edit"
          element={
            <IsPrivate>
              <PlantasticOutlet>
                <EditRecipePage />
              </PlantasticOutlet>
            </IsPrivate>
          }
        ></Route>
        <Route
          path="/recipes/new"
          element={
            <IsPrivate>
              <PlantasticOutlet>
                <CreateRecipePage />
              </PlantasticOutlet>
            </IsPrivate>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <RouteProtector>
              <PlantasticOutlet>
                <ProfilePage />
              </PlantasticOutlet>
            </RouteProtector>
          }
        ></Route>
        <Route
          path="/plan/:planId"
          element={
            <RouteProtector>
              <PlantasticOutlet>
                <PlanPage />
              </PlantasticOutlet>
            </RouteProtector>
          }
        ></Route>
        <Route
          path="/plan/new"
          element={
            <RouteProtector>
              <PlantasticOutlet>
                <CreatePlanPage />
              </PlantasticOutlet>
            </RouteProtector>
          }
        ></Route>
        <Route
          path="/about"
          element={
            <PlantasticOutlet>
              <AboutPage />
            </PlantasticOutlet>
          }
        ></Route>
      </Routes>
    </>
  );
}

export default App;
