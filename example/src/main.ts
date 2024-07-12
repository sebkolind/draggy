import { draggy } from "@sebkolind/draggy";

draggy({
  draggable: ".draggable",
  dropzone: ".dropzone",
  isDropzone: ({ el }) => el.classList.contains("dropzone"),
  onDrop: () => {
    console.log("I was dropped!");

    return ({ dragged, target }) => {
      target.append(dragged);
    };
  },
});
