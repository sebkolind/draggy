import { test, expect } from "@playwright/test";

test("can drag&drop cards", async ({ page }) => {
  await page.goto("/");

  const draggable = page.locator(".card").first();
  const box = await draggable.boundingBox();
  if (!box) throw new Error("Bounding box not found");

  await draggable.dragTo(draggable, {
    force: true,
    targetPosition: {
      x: 0,
      y: box.height * 2,
    },
  });

  const column = page.locator(".column").first();
  const [card1, card2] = await column.evaluate((div) => [
    div.children[0]!.textContent,
    div.children[1]!.textContent,
  ]);

  expect(card1?.includes("Announce the v0.0.1 release")).toBe(true);
  expect(card2?.includes("Build a React integration")).toBe(true);
});

test("can shift-click and drag&drop multiple cards", async ({ page }) => {
  await page.goto("/");

  const firstCard = page.locator(".card").nth(0);
  const secondCard = page.locator(".card").nth(1);

  await page.keyboard.down("Shift");
  await firstCard.click();

  await secondCard.click();
  await page.keyboard.up("Shift");

  const box = await secondCard.boundingBox();
  if (!box) throw new Error("Bounding box not found");

  await secondCard.dragTo(secondCard, {
    force: true,
    targetPosition: {
      x: 0,
      y: box.height * 4,
    },
  });

  const column = page.locator(".column").first();
  const [card1, card2] = await column.evaluate((div) => [
    div.children[2]!.textContent,
    div.children[3]!.textContent,
  ]);

  expect(card1?.includes("Announce the v0.0.1 release")).toBe(true);
  expect(card2?.includes("Build a React integration")).toBe(true);
});
