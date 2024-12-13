/**
 * Class to represent the game's state, including inventory and max inventory size.
 */
export class GameState {
  inventory: { [key: string]: number } = {}; // Tracks item quantities in inventory
  maxInventorySize: number = 12; // Maximum number of items the player can hold
}

export const gameState = new GameState(); // Singleton instance to manage global game state

/**
 * Represents an item that can be collected or crafted.
 */
export interface Item {
  name: string; // Name of the item
  type: string; // Type of the item (e.g., resource, tool)
  value: number; // Value of the item (e.g., for selling)
  description: string; // Description of the item
}

/**
 * Represents a crafting recipe for creating an item.
 */
export interface CraftingRecipe {
  name: string; // Name of the crafted item
  requirements: { [key: string]: number }; // Items and quantities required for crafting
  value: number; // Value of the crafted item
  description: string; // Description of the crafted item
  effect?: { inventoryIncrease?: number }; // Optional effect (e.g., increasing inventory size)
}

/**
 * List of items available in the game.
 */
export let availableItems: Item[] = [];

/**
 * List of crafting recipes available in the game.
 */
export let craftingRecipes: CraftingRecipe[] = [];

/**
 * Loads game data from a JSON file.
 */
export async function loadGameData(): Promise<void> {
  try {
    const response = await fetch("data/items.json");
    const data = await response.json();

    // Populate available items and crafting recipes
    availableItems = data.items;
    craftingRecipes = data.recipes;

    console.log("Game data loaded:", { availableItems, craftingRecipes });
  } catch (error) {
    console.error("Failed to load game data:", error);
  }
}
