import { fireEvent, screen } from "@testing-library/dom";
import { draggy } from "../main";

const html = `
  <div class="columns">
    <div class="column">
      <div class="card">Card 1</div>
      <div class="card">Card 2</div>
    </div>
    <div class="column">
      <div class="card">Card 1</div>
      <div class="card">Card 2</div>
      <div class="card">Card 3</div>
    </div>
    <div class="column">
      <div class="card">Card 1</div>
      <div class="card">Card 2</div>
      <div class="card">Card 3</div>
      <div class="card">Card 4</div>
    </div>
  </div>
`;

beforeEach(() => {
  document.body.innerHTML = html;
});

describe("draggy", () => {
  test("that target can be a selector string", () => {
    draggy({
      target: ".column",
      placement: "any",
    });

    expect(screen.getByText("Card 4")).toBeTruthy();
  });

  test("that target can be an Element", () => {
    draggy({
      target: document.querySelectorAll(".column"),
      placement: "any",
    });

    expect(screen.getByText("Card 4")).toBeTruthy();
  });

  test("that onStart is fired if defined", () => {
    const onStart = jest.fn();

    draggy({
      target: document.querySelectorAll(".column"),
      onStart,
    });

    const draggable = screen.getByText("Card 4");

    fireEvent.mouseDown(draggable);

    expect(onStart).toHaveBeenCalledTimes(1);
  });

  test("that onBeforeDrop is fired if defined", () => {
    const onBeforeDrop = jest.fn();

    draggy({ target: ".column", onBeforeDrop });

    const draggable = screen.getByText("Card 4");

    fireEvent.mouseDown(draggable);
    fireEvent.mouseUp(draggable);

    expect(onBeforeDrop).toHaveBeenCalledTimes(1);
  });

  test("that onDrop is fired if defined", () => {
    const onDrop = jest.fn();

    draggy({ target: ".column", onDrop });

    const draggable = screen.getByText("Card 4");

    fireEvent.mouseDown(draggable);
    fireEvent.mouseUp(draggable);

    expect(onDrop).toHaveBeenCalledTimes(1);
  });

  // @TODO: This is a bit weak.
  // The test should be a bit more in-depth with removing context.events + event on each draggable.
  test("that destroy removes the mouseup event", () => {
    jest.spyOn(document, "addEventListener").mockImplementation(jest.fn());
    jest.spyOn(document, "removeEventListener").mockImplementation(jest.fn());

    const { destroy } = draggy({ target: ".column" });

    expect(destroy).toBeDefined();

    destroy();

    expect(document.removeEventListener).toHaveBeenCalled();
  });
});
