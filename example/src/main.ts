import { draggy } from "@sebkolind/draggy";

draggy({
  target: ".column",
  optimistic: false,
  onDrop(_, { dragged, dropzone }) {
    const status = dropzone?.dataset.status;
    const el = dragged.querySelector(".status");
    if (el && status) {
      el.classList.remove("to-do", "in-progress", "done");
      el.classList.add(status);
      el.textContent = formatStatus(status);
    }
  },
});

const formatStatus = (status: string) => {
  switch (status) {
    case "to-do":
      return "To-do";
    case "in-progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
};
