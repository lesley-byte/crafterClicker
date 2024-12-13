import { loadGameData } from "./gameData.js";
import { setupActionButtons } from "./actions.js";
import { setupCraftingButtons } from "./crafting.js";
import { updateInventoryDisplay } from "./display.js";

/**
 * Initializes the game by loading data and setting up UI components.
 */
function initGame(): void {
  loadGameData()
    .then(() => {
      setupActionButtons();
      setupCraftingButtons();
      updateInventoryDisplay();
    })
    .catch((error: unknown) => {
      console.error("Failed to initialize the game:", error);
    });
}

// Wait for the DOM to load before initializing the game
document.addEventListener("DOMContentLoaded", initGame);
