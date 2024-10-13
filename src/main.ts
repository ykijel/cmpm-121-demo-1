import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Spooky Clicker";
document.title = gameName;

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
itemsPurchasedDiv.textContent = "Upgrades Purchased: Ghouls: 0, Haunted Houses: 0, Cursed Graveyards: 0";
itemsPurchasedDiv.classList.add("items-purchased-display");
mainArea.append(itemsPurchasedDiv);

// Initialize purchase counts for each item
const purchasedCounts: number[] = new Array(3).fill(0);

// Define the available items using the new interface
interface Item {
  name: string;
  cost: number;
  rate: number;
}

// Available items with costs and growth rates
const availableItems: Item[] = [
  { name: "Summon a Ghoul", cost: 10, rate: 0.1 },
  { name: "Haunted House", cost: 100, rate: 2.0 },
  { name: "Cursed Graveyard", cost: 1000, rate: 50.0 },
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

// Function to create an upgrade button
const createUpgradeButton = (item: Item, index: number) => {
  const button = document.createElement("button");
  button.textContent = `Buy ${item.name} (${item.cost.toFixed(2)} spooks)`;
  button.classList.add("upgrade-button");
  button.disabled = true;

  button.addEventListener("click", () => {
    const currentCost = availableItems[index].cost;

    if (counter >= currentCost) {
      counter -= currentCost;
      growthRate += item.rate;

      // Update the cost for the next purchase by increasing it by a factor of 1.15
      availableItems[index].cost *= 1.15;
      purchasedCounts[index]++;

      updateCounterDisplay();
      updateGrowthRateDisplay();
      updateItemsPurchased();
      updateUpgradeButtonsState();
      updateUpgradeButtonLabels(); // Update the displayed cost on each button
    }
  });

  upgradesArea.append(button);
  return button;
};

// Create and store the buttons for each upgrade item dynamically
const upgradeButtons: HTMLButtonElement[] = availableItems.map((item, index) =>
  createUpgradeButton(item, index)
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
  itemsPurchasedDiv.textContent = `Upgrades Purchased: Ghouls: ${purchasedCounts[0]}, Haunted Houses: ${purchasedCounts[1]}, Cursed Graveyards: ${purchasedCounts[2]}`;
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
