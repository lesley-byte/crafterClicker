import { gameState, CraftingRecipe, craftingRecipes } from "./gameData.js";
import { updateInventoryDisplay } from "./display.js";

/**
 * Handles crafting an item by checking inventory requirements,
 * deducting used items, and applying any special effects.
 * 
 * @param itemName - The name of the item to craft
 */
export function craftItem(itemName: string): void {
  // Find the crafting recipe for the specified item
  const recipe: CraftingRecipe | undefined = craftingRecipes.find(
    (r: CraftingRecipe) => r.name === itemName
  );

  if (!recipe) {
    alert(`Crafting recipe for "${itemName}" not found.`);
    return;
  }

  // Check if all required items are available in the inventory
  for (const [requiredItem, quantity] of Object.entries(recipe.requirements)) {
    const itemQuantity: number = gameState.inventory[requiredItem] || 0;
    if (itemQuantity < quantity) {
      alert(`Not enough ${requiredItem} to craft "${itemName}".`);
      return;
    }
  }

  // Deduct required items from the inventory
  for (const [requiredItem, quantity] of Object.entries(recipe.requirements)) {
    gameState.inventory[requiredItem] -= quantity;
  }

  // Apply special effects (e.g., increasing inventory size)
  if (recipe.effect?.inventoryIncrease) {
    gameState.maxInventorySize += recipe.effect.inventoryIncrease;
    alert(`You crafted a ${itemName}! Inventory capacity increased.`);
  } else {
    alert(`You crafted a ${itemName}!`);
  }

  // Update the inventory display to reflect changes
  updateInventoryDisplay();
}

/**
 * Dynamically creates buttons for crafting items based on available recipes.
 */
export function setupCraftingButtons(): void {
  const craftingContainer: HTMLElement | null = document.getElementById("crafting-buttons");
  if (!craftingContainer) {
    console.error("Crafting container element not found!");
    return;
  }

  // Clear any existing buttons
  craftingContainer.innerHTML = "";

  // Create a button for each crafting recipe
  craftingRecipes.forEach((recipe: CraftingRecipe): void => {
    const button: HTMLButtonElement = document.createElement("button");
    button.textContent = `Craft ${recipe.name}`;
    button.className = "btn btn-primary mb-2";
    button.addEventListener("click", () => craftItem(recipe.name)); // Attach event listener
    craftingContainer.appendChild(button);
  });
}
