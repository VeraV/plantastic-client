import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getIngredients, getInstructions } from "../helpers/stringFormats";

const API_URL = "http://localhost:5005";

export const CreatePlanPage = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [duration, setDuration] = useState(15);
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [errorMessage, setErrorMessage] = useState();

  const nav = useNavigate();
  const storedToken = localStorage.getItem("authToken");

  async function handleCreateRecipe(e) {}

  return <h1>New Plan Page</h1>;
};
