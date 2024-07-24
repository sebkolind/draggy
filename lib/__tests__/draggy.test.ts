import { fireEvent, screen, waitFor } from "@testing-library/dom";
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
    <div class="column" data-testid="column">
      <div class="card">Card 1</div>
      <div class="card">Card 2</div>
      <div class="card">Card 3</div>
      <div class="card">Card 4</div>
      <div class="card">Card 5</div>
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

  test("that events are fired if defined", () => {
    const onStart = jest.fn();
    const onBeforeDrop = jest.fn();
    const onDrop = jest.fn();
    const onCreateShadow = jest.fn();

    draggy({
      target: document.querySelectorAll(".column"),
      onStart,
      onBeforeDrop,
      onDrop,
      onCreateShadow,
    });

    const draggable = screen.getByText("Card 4");

    fireEvent.mouseDown(draggable);
    fireEvent.mouseUp(draggable);

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onBeforeDrop).toHaveBeenCalledTimes(1);
    expect(onDrop).toHaveBeenCalledTimes(1);
    expect(onCreateShadow).toHaveBeenCalledTimes(1);
  });

  test("that multi-selection starts", async () => {
    const onStart = jest.fn();

    draggy({
      target: ".column",
      onStart,
    });

    const column = await screen.findByTestId("column");
    const draggable1 = await screen.findByText("Card 4");
    const draggable2 = await screen.findByText("Card 5");

    fireEvent.mouseDown(draggable1, { shiftKey: true });
    fireEvent.mouseDown(draggable2, { shiftKey: true });
    fireEvent.mouseDown(draggable2);

    const shadow = document.querySelector(".draggy-dragging");

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalledWith(new MouseEvent("mousedown"), {
      multiple: [
        {
          origin: draggable1,
          nextSibling: draggable2,
          originZone: column,
          style: {
            display: "",
          },
        },
        {
          origin: draggable2,
          nextSibling: null,
          originZone: column,
          style: {
            display: "",
          },
        },
      ],
      origin: draggable2,
      shadow,
      zone: null,
    });
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
