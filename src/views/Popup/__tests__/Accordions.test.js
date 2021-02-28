import React from "react";
import ReactDOM from "react-dom";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Accordions from "../Accordions";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Accordions />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders correctely all Accordions", () => {
  render(<Accordions />);
  expect(screen.getByText("Instructions")).toBeInTheDocument();
  expect(screen.getByText("Colours legend")).toBeInTheDocument();
  expect(screen.getByText("Limitations")).toBeInTheDocument();
});
