export const CookingInstructions = ({ instructions }) => {
  const ar = instructions.split("|").map((el) => el.trim());
  return (
    <ol className="instructions">
      {ar.map((el, ind) => {
        return <li key={ind}>{el}</li>;
      })}
    </ol>
  );
};
