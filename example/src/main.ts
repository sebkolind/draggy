import {draggy} from "@sebkolind/draggy";

draggy({
  target: ".column",
  placement: "any",
  selection: {
    enabled: true,
  },
  onStart(_, {shadow, multiple}) {
    if (!multiple?.length) return;

    const label = document.createElement("div");
    label.textContent = multiple.length.toString();
    label.style.position = "absolute";
    label.style.top = "0";
    label.style.right = "0";
    label.style.transform = "translate(50%, -50%)";
    label.style.backgroundColor = "red";
    label.style.color = "white";
    label.style.borderRadius = "50%";
    label.style.padding = "2px 6px";
    label.style.fontSize = "12px";
    label.style.zIndex = "9999";

    shadow?.append(label);
  },
  onDrop(_, {origin, zone}) {
    const el = origin?.querySelector(".status")
    if (!el) return;
    const status = el.textContent?.toLowerCase().replace(" ", "-");
    const newStatus = zone?.dataset.status;
    if (!newStatus || !status) return;
    if (status === newStatus) return;

    el.textContent = formatStatus(newStatus);
    el.classList.remove(status);
    el.classList.add(newStatus);
  }
});

function formatStatus(status: string) {
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
}
