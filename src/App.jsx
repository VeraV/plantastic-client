import { useState } from "react";
import "./App.css";
import "./embla.css";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
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
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/recipes"
          element={
            <PlantasticOutlet>
              <RecipesPage />
            </PlantasticOutlet>
          }
        />
        <Route
          path="/recipes/:recipeId"
          element={
            <PlantasticOutlet>
              <RecipePage />
            </PlantasticOutlet>
          }
        />
        <Route
          path="/recipes/:recipeId/edit"
          element={
            <IsPrivate>
              <PlantasticOutlet>
                <EditRecipePage />
              </PlantasticOutlet>
            </IsPrivate>
          }
        />
        <Route
          path="/recipes/new"
          element={
            <IsPrivate>
              <PlantasticOutlet>
                <CreateRecipePage />
              </PlantasticOutlet>
            </IsPrivate>
          }
        />
        <Route
          path="/profile"
          element={
            <RouteProtector>
              <PlantasticOutlet>
                <ProfilePage />
              </PlantasticOutlet>
            </RouteProtector>
          }
        />
        <Route
          path="/plan/:planId"
          element={
            <RouteProtector>
              <PlantasticOutlet>
                <PlanPage />
              </PlantasticOutlet>
            </RouteProtector>
          }
        />
        <Route
          path="/plan/new"
          element={
            <RouteProtector>
              <PlantasticOutlet>
                <CreatePlanPage />
              </PlantasticOutlet>
            </RouteProtector>
          }
        />
        <Route
          path="/about"
          element={
            <PlantasticOutlet>
              <AboutPage />
            </PlantasticOutlet>
          }
        />
      </Routes>
    </>
  );
}

export default App;
