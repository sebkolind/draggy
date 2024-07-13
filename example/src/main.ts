import { draggy } from "@sebkolind/draggy";

draggy({
  draggable: ".draggable",
  dropzone: ".dropzone",
  isDropzone: ({ el }) => el.classList.contains("draggy-dropzone"),
});
