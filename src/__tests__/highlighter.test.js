import initialiseHighlighter from "../highlighter";

global.chrome = {
  tabs: {
    query: jest.fn(),
  },
};

it("renders without crashing", () => {
  initialiseHighlighter(".test");
});
