import { gameState, Item, availableItems } from "./gameData.js";
import { updateInventoryDisplay } from "./display.js";

/**
 * Dynamically creates buttons for collecting items.
 */
export function setupActionButtons(): void {
  const actionContainer: HTMLElement | null = document.getElementById("action-buttons");
  if (!actionContainer) {
    console.error("Action container element not found!");
    return;
  }

  // List of actions for item collection
  const actions: string[] = availableItems.map((item: Item) => item.name); // Dynamically derived from `availableItems`
  actionContainer.innerHTML = ""; // Clear existing buttons

  actions.forEach((action: string): void => {
    const button: HTMLButtonElement = document.createElement("button");
    button.textContent = `Pick up ${action}`;
    button.className = "btn btn-primary mb-2";
    button.addEventListener("click", () => collectItem(action)); // Attach event listener
    actionContainer.appendChild(button);
  });
}

/**
 * Collects an item and updates the inventory.
 *
 * @param itemName - The name of the item to collect
 */
export function collectItem(itemName: string): void {
  // Calculate the total number of items in the inventory
  const totalItems: number = Object.values(gameState.inventory).reduce(
    (sum: number, count: number): number => sum + count,
    0
  );

  if (totalItems >= gameState.maxInventorySize) {
    alert("Inventory full! Craft or sell items to make space.");
    return;
  }

  // Find the item in the available items list
  const item: Item | undefined = availableItems.find((item: Item) => item.name === itemName);
  if (!item) {
    console.error(`Item "${itemName}" is not available to pick up.`);
    return;
  }

  // Add the item to the inventory
  gameState.inventory[itemName] = (gameState.inventory[itemName] || 0) + 1;
  updateInventoryDisplay();
}
