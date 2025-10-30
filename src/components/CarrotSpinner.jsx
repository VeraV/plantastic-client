const CarrotSpinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "200px" }}
    >
      <div
        className="carrot-spinner display-4"
        role="status"
        aria-label="Loading"
      >
        🥕
      </div>
    </div>
  );
};

export default CarrotSpinner;
