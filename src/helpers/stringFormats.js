export const showIngredients = (arr) => {
  const formattedString = arr.join("\n");
  return formattedString;
};

export const getIngredients = (str) => {
  const formattedArray = str.split("\n").map((el) => el.trim());
  return formattedArray;
};

export const showInstructions = (str) => {
  return str
    .split("|")
    .map((el) => el.trim())
    .join("\n");
};

export const getInstructions = (str) => {
  return str
    .split("\n")
    .map((el) => el.trim())
    .join("|");
};
