import { gameState } from "./gameData.js";

/**
 * Updates the inventory display in the UI.
 */
export function updateInventoryDisplay(): void {
  const inventoryList: HTMLElement | null = document.getElementById("inventory-list");
  if (!inventoryList) {
    console.error("Inventory list element not found!");
    return;
  }

  inventoryList.innerHTML = ""; // Clear the current inventory display

  // Calculate the total number of items in the inventory
  const totalItems: number = Object.values(gameState.inventory).reduce(
    (sum: number, count: number): number => sum + count,
    0
  );

  if (totalItems === 0) {
    inventoryList.innerHTML = "<li class='list-group-item'>Inventory is empty.</li>";
    return;
  }

  // Populate the inventory list with items and their quantities
  for (const [item, quantity] of Object.entries(gameState.inventory)) {
    if (quantity > 0) {
      const listItem: HTMLLIElement = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = `${item}: ${quantity}`;
      inventoryList.appendChild(listItem);
    }
  }
}
