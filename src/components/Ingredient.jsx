export const Ingredient = ({ ingredient }) => {
  //example IN: "potato| 3| kg " => OUT: "Potato 3kg" or "Salt"
  //console.log(ingredient);
  const ar = ingredient.split("|").map((el) => el.trim());
  const name = ar[0][0].toUpperCase() + ar[0].substring(1).toLowerCase();

  return (
    <div className="ingredient">
      <p>{name}</p>
      {/*ar[1] && <p className="quantity">{`${ar[1]}${ar[2]}`}</p>*/}
      {ar[1] && <p className="quantity">{`${ar[1]}`}</p>}
    </div>
  );
};
