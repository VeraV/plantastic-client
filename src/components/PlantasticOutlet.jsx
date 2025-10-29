import { Children } from "react";
import { Navbar } from "./Navbar";
export const PlantasticOutlet = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
