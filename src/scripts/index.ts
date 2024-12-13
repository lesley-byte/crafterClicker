// Function to dynamically create buttons for actions
function setupActionButtons(): void {
  const actionContainer: HTMLElement | null = document.getElementById("action-buttons");
  if (!actionContainer) {
    console.error("Action container element not found!");
    return;
  }

  const actions = ["Stick", "Stone", "Rag", "Metal Bit"];
  actionContainer.innerHTML = ""; // Clear existing buttons

  actions.forEach((action) => {
    const button: HTMLButtonElement = document.createElement("button");
    button.textContent = `Pick up ${action}`;
    button.className = "btn btn-primary mb-2";
    button.addEventListener("click", () => collectItem(action)); // Attach event listener
    actionContainer.appendChild(button);
  });
}

// Define the inventory and its capacity
interface Inventory {
  [key: string]: number; // Each key is a string (item name) with a numeric quantity
}

let inventory: Inventory = {}; // Stores the player's items
let maxInventorySize: number = 12; // Maximum number of items the player can hold

// Interfaces for item and recipe data
interface Item {
  name: string;
  type: string;
  value: number;
  description: string;
}

interface Recipe {
  [key: string]: number; // Each key is an item name with a required quantity
}

interface CraftingRecipe {
  name: string;
  requirements: Recipe;
  value: number;
  description: string;
  effect?: { inventoryIncrease?: number };
}

// Dynamically loaded game data
let availableItems: Item[] = [];
let craftingRecipes: CraftingRecipe[] = [];

// Function to load game data from `items.json`
async function loadGameData(): Promise<void> {
  try {
    const response = await fetch("data/items.json");
    const data = await response.json();

    availableItems = data.items;
    craftingRecipes = data.recipes;

    console.log("Game data loaded:", { availableItems, craftingRecipes });
    setupCraftingButtons(); // Initialize crafting buttons based on recipes
  } catch (error) {
    console.error("Failed to load game data:", error);
  }
}

// Function to collect an item
function collectItem(itemName: string): void {
  const totalItems: number = Object.values(inventory).reduce((sum, count) => sum + count, 0);

  if (totalItems >= maxInventorySize) {
    alert("Inventory full! Craft or sell items to make space.");
    return;
  }

  const item = availableItems.find((item) => item.name === itemName);
  if (!item) {
    console.error(`Item "${itemName}" is not available to pick up.`);
    return;
  }

  inventory[itemName] = (inventory[itemName] || 0) + 1;
  updateInventoryDisplay();
}

// Function to craft an item
function craftItem(itemName: string): void {
  const recipe = craftingRecipes.find((r) => r.name === itemName);
  if (!recipe) {
    alert(`Crafting recipe for "${itemName}" not found.`);
    return;
  }

  // Check if all required items are in the inventory
  for (const [requiredItem, quantity] of Object.entries(recipe.requirements)) {
    if ((inventory[requiredItem] || 0) < quantity) {
      alert(`Not enough ${requiredItem} to craft "${itemName}".`);
      return;
    }
  }

  // Deduct required items from the inventory
  for (const [requiredItem, quantity] of Object.entries(recipe.requirements)) {
    inventory[requiredItem] -= quantity;
  }

  // Apply special effects, if any
  if (recipe.effect?.inventoryIncrease) {
    maxInventorySize += recipe.effect.inventoryIncrease;
    alert(`You crafted a ${itemName}! Inventory capacity increased.`);
  } else {
    alert(`You crafted a ${itemName}!`);
  }

  updateInventoryDisplay();
}

// Function to update the inventory display
function updateInventoryDisplay(): void {
  const inventoryList: HTMLElement | null = document.getElementById("inventory-list");
  if (!inventoryList) {
    console.error("Inventory list element not found!");
    return;
  }

  inventoryList.innerHTML = ""; // Clear the current inventory display

  const totalItems: number = Object.values(inventory).reduce((sum, count) => sum + count, 0);

  if (totalItems === 0) {
    inventoryList.innerHTML = "<li class='list-group-item'>Inventory is empty.</li>";
    return;
  }

  for (const [item, quantity] of Object.entries(inventory)) {
    if (quantity > 0) {
      const listItem: HTMLLIElement = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.textContent = `${item}: ${quantity}`;
      inventoryList.appendChild(listItem);
    }
  }
}

// Function to dynamically set up crafting buttons
function setupCraftingButtons(): void {
  const craftingContainer: HTMLElement | null = document.getElementById("crafting-buttons");
  if (!craftingContainer) {
    console.error("Crafting container element not found!");
    return;
  }

  craftingContainer.innerHTML = ""; // Clear existing buttons

  craftingRecipes.forEach((recipe) => {
    const button: HTMLButtonElement = document.createElement("button");
    button.textContent = `Craft ${recipe.name}`;
    button.className = "btn btn-primary mb-2";
    button.addEventListener("click", () => craftItem(recipe.name)); // Attach event listener
    craftingContainer.appendChild(button);
  });
}

// Single consolidated initialization function
function initGame(): void {
  loadGameData(); // Load item and recipe data
  setupActionButtons(); // Set up action buttons dynamically
  updateInventoryDisplay(); // Update the inventory display
}

// Run the game initialization when the page loads
document.addEventListener("DOMContentLoaded", initGame);
