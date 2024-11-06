import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Spooky Clicker";
document.title = gameName;

// Define a named constant for cost increase
const COST_INCREASE_FACTOR = 1.15;

// Create a wrapper for the entire game content
const gameContainer = document.createElement("div");
gameContainer.classList.add("game-container");
app.append(gameContainer);

// Create the main content area (for the button and counter)
const mainArea = document.createElement("div");
mainArea.classList.add("main-area");
gameContainer.append(mainArea);

// Create the upgrades section
const upgradesArea = document.createElement("div");
upgradesArea.classList.add("upgrades-area");
gameContainer.append(upgradesArea);

// Game title
const header = document.createElement("h1");
header.innerHTML = gameName;
mainArea.append(header);

let counter: number = 0;
let fractionalCounter: number = 0;
let growthRate: number = 0;

// Create a div to display the counter
const counterDiv: HTMLDivElement = document.createElement("div");
counterDiv.textContent = `${counter.toFixed(0)} spooks collected`;
counterDiv.classList.add("counter-display");
mainArea.append(counterDiv);

// Create a div to display the growth rate
const growthRateDiv: HTMLDivElement = document.createElement("div");
growthRateDiv.textContent = `Current Growth Rate: ${growthRate.toFixed(1)} spooks/sec`;
growthRateDiv.classList.add("growth-rate-display");
mainArea.append(growthRateDiv);

// Create a div to display the number of items purchased
const itemsPurchasedDiv: HTMLDivElement = document.createElement("div");
itemsPurchasedDiv.textContent =
  "Upgrades Purchased: Ghouls: 0, Haunted Houses: 0, Cursed Graveyards: 0, Witch Covens: 0, Phantom Orchestras: 0";
itemsPurchasedDiv.classList.add("items-purchased-display");
mainArea.append(itemsPurchasedDiv);

// UpgradeItem class to encapsulate each item's properties and behavior
class UpgradeItem {
  name: string;
  cost: number;
  rate: number;
  description: string;
  purchasedCount: number = 0;

  constructor(name: string, cost: number, rate: number, description: string) {
    this.name = name;
    this.cost = cost;
    this.rate = rate;
    this.description = description;
  }

  // Method to handle purchasing the item
  purchase(): boolean {
    if (counter >= this.cost) {
      counter -= this.cost;
      growthRate += this.rate;
      this.cost *= COST_INCREASE_FACTOR; // Use constant for cost increase factor
      this.purchasedCount++;
      return true;
    }
    return false;
  }
}

// Available items with costs, growth rates, and descriptions
const availableItems: UpgradeItem[] = [
  new UpgradeItem("Summon a Ghoul", 10, 0.1, "Ghouls roam the graveyard and gather spooks for you."),
  new UpgradeItem("Haunted House", 100, 2.0, "A creepy house that lures in the brave, collecting spooks."),
  new UpgradeItem("Cursed Graveyard", 1000, 50.0, "An ancient graveyard brimming with restless spirits."),
  new UpgradeItem("Witch Coven", 5000, 200, "A coven of witches brewing spooky potions every second."),
  new UpgradeItem("Phantom Orchestra", 25000, 1000, "An eerie orchestra that haunts the land with ghostly music.")
];

// Create a button element for clicking to increase counter (Main Ghost button)
const clickButton: HTMLButtonElement = document.createElement("button");
clickButton.textContent = "👻";
clickButton.classList.add("main-click-button");

clickButton.addEventListener("click", function () {
  counter++;
  updateCounterDisplay();
  updateUpgradeButtonsState();
});

mainArea.append(clickButton);

// Function to create an upgrade button element
const createUpgradeButtonElement = (item: UpgradeItem, index: number): HTMLButtonElement => {
  const button = document.createElement("button");
  button.textContent = `Buy ${item.name} (${item.cost.toFixed(2)} spooks)`;
  button.classList.add("upgrade-button");
  button.disabled = true;
  button.addEventListener("click", () => handleUpgradePurchase(index));
  return button;
};

// Function to handle the purchase of an upgrade item
const handleUpgradePurchase = (index: number) => {
  const item = availableItems[index];
  if (item.purchase()) {
    updateCounterDisplay();
    updateGrowthRateDisplay();
    updateItemsPurchased();
    updateUpgradeButtonsState();
    updateUpgradeButtonLabels(); // Update the displayed cost on each button
  }
};

// Helper function to create the item description
const createItemDescription = (description: string): HTMLParagraphElement => {
  const descriptionElement = document.createElement("p");
  descriptionElement.textContent = description;
  descriptionElement.classList.add("item-description");
  return descriptionElement;
};

// Main function to create an upgrade button with a description and wrapper
const createUpgradeButton = (item: UpgradeItem, index: number): HTMLButtonElement => {
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("upgrade-wrapper");

  const button = createUpgradeButtonElement(item, index);
  const description = createItemDescription(item.description);

  buttonWrapper.append(button, description);
  upgradesArea.append(buttonWrapper);

  return button;
};

// Create and store the buttons for each upgrade item dynamically
const upgradeButtons: HTMLButtonElement[] = availableItems.map((item, index) =>
  createUpgradeButton(item, index),
);

// Function to update the counter display
const updateCounterDisplay = () => {
  counterDiv.textContent = `${counter.toFixed(0)} spooks collected`;
};

// Function to update the growth rate display
const updateGrowthRateDisplay = () => {
  growthRateDiv.textContent = `Current Growth Rate: ${growthRate.toFixed(1)} spooks/sec`;
};

// Function to update the number of purchased items
const updateItemsPurchased = () => {
  itemsPurchasedDiv.textContent = `Upgrades Purchased: Ghouls: ${availableItems[0].purchasedCount}, Haunted Houses: ${availableItems[1].purchasedCount}, Cursed Graveyards: ${availableItems[2].purchasedCount}, Witch Covens: ${availableItems[3].purchasedCount}, Phantom Orchestras: ${availableItems[4].purchasedCount}`;
};

// Function to update the upgrade button labels with the new costs
const updateUpgradeButtonLabels = () => {
  upgradeButtons.forEach((button, index) => {
    const item = availableItems[index];
    button.textContent = `Buy ${item.name} (${item.cost.toFixed(2)} spooks)`;
  });
};

// Function to enable/disable upgrade buttons based on the counter
const updateUpgradeButtonsState = () => {
  availableItems.forEach((item, index) => {
    const button = upgradeButtons[index];
    const currentCost = item.cost;

    if (counter >= currentCost) {
      button.disabled = false;
      button.style.backgroundColor = "#28a745"; // Green when purchasable
      button.style.cursor = "pointer";
    } else {
      button.disabled = true;
      button.style.backgroundColor = "gray";
      button.style.cursor = "not-allowed";
    }
  });
};

// Track the previous timestamp for frame calculation
let lastTimestamp: number = 0;

const animate = (timestamp: number) => {
  if (lastTimestamp !== 0) {
    const deltaTime = (timestamp - lastTimestamp) / 1000; // Time difference in seconds
    fractionalCounter += deltaTime * growthRate; // Increment based on growth rate

    if (fractionalCounter >= 1) {
      const wholeIncrements = Math.floor(fractionalCounter);
      counter += wholeIncrements;
      fractionalCounter -= wholeIncrements;
      updateCounterDisplay();
      updateUpgradeButtonsState();
    }
  }

  lastTimestamp = timestamp;
  requestAnimationFrame(animate);
};

requestAnimationFrame(animate);
