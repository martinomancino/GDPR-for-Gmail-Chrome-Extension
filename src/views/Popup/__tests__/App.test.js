import React from "react";
import ReactDOM from "react-dom";
import { render } from "@testing-library/react";
import App from "../App";

global.chrome = {
  tabs: {
    query: jest.fn(),
  },
};

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders correctly the popup content", () => {
  const { getByAltText } = render(<App />);
  expect(getByAltText("GDPR highlighter logo")).toMatchSnapshot();
});
