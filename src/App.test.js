import React from "react";
import { act } from "react-dom/test-utils";
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import "jest-enzyme";
import branch1 from "../public/api/branch1.json";
import branch2 from "../public/api/branch2.json";
import branch3 from "../public/api/branch3.json";
import App from "./App";

configure({
  adapter: new Adapter(),
});

const responses = {
  "./api/branch1.json": branch1,
  "./api/branch2.json": branch2,
  "./api/branch3.json": branch3,
};

global.fetch = (endpoint) =>
  Promise.resolve({
    json: () => Promise.resolve(responses[endpoint]),
  });

// based on https://blog.pragmatists.com/genuine-guide-to-testing-react-redux-applications-6f3265c11f63
const flushAllPromises = () => new Promise((resolve) => setImmediate(resolve));

export const flushRequestsAndUpdate = async (enzymeWrapper) => {
  await act(async () => {
    await flushAllPromises();
    enzymeWrapper.update();
  });
};

it("renders without crashing", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);
});

it("renders loading text initially", async () => {
  const app = mount(<App />);
  expect(app).toIncludeText("Loading...");
  await flushRequestsAndUpdate(app);
});

it("renders a table after data load", async () => {
  const app = mount(<App />);
  expect(app).toIncludeText("Loading...");
  await flushRequestsAndUpdate(app);
  expect(app).not.toIncludeText("Loading...");
});

it("renders rows with id as key", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);

  expect(app.find("table tbody tr").at(56).key()).toEqual("098");
  expect(app.find("table tbody tr").at(73).key()).toEqual("047");
});

it("renders table that is sorted ascending", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);
  expect(app.find("table")).toMatchSnapshot();
});

it("calculates total revenue of all branches", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);
  expect(app.find("tfoot td:last-child").text()).toEqual("2,102,619.44");
});

it("filters the displayed products", async () => {
  const app = mount(<App />);
  await flushRequestsAndUpdate(app);
  const changeEvent = { target: { value: "pear" } };
  app.find("input").simulate("change", changeEvent);
  expect(app.find("tfoot td:last-child").text()).toEqual("60,681.02");
});
