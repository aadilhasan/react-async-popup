import React from 'react';
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Confirm } from "../dist"

let container = null;
let showConfirm = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
  showConfirm = null;
});


describe("Confirm component", () => {
  let showConfirm;
  it(" mounted at the container  ", () => {
    expect(container.children.length).toBe(0);
    act(() => {
      Confirm.new({ container }).then(({ show }) => {
        showConfirm = show;
        show({
          heading: 'Heading'
        });
      })
    });
    expect(container.children.length).toBe(1);
  });
  it(" closes on cancel", () => {
    expect(container.children.length).toBe(0);
    act(() => {
      Confirm.new({ container }).then(({ show }) => {
        showConfirm = show;
        show({
          heading: "This is Heading",
        })
      })
    });
    expect(container.children.length).toBe(1);
  });
})