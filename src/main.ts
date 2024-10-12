import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Yahli's Incremental Game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

let counter: number = 0;
let fractionalCounter: number = 0;
let growthRate: number = 0;

// Create a div to display the counter
const counterDiv: HTMLDivElement = document.createElement("div");
counterDiv.textContent = `${counter.toFixed(0)} spooks`;
counterDiv.style.fontSize = "24px";
counterDiv.style.margin = "20px 0";
app.append(counterDiv);

// Create a div to display the growth rate
const growthRateDiv: HTMLDivElement = document.createElement("div");
growthRateDiv.textContent = `Current Growth Rate: ${growthRate.toFixed(1)} spooks/sec`;
growthRateDiv.style.fontSize = "20px";
growthRateDiv.style.margin = "20px 0";
app.append(growthRateDiv);

// Create a div to display the number of items purchased
const itemsPurchasedDiv: HTMLDivElement = document.createElement("div");
itemsPurchasedDiv.textContent = "Items Purchased: A: 0, B: 0, C: 0";
itemsPurchasedDiv.style.fontSize = "20px";
itemsPurchasedDiv.style.margin = "20px 0";
app.append(itemsPurchasedDiv);

// Initialize purchase counts for each upgrade
let purchasedA = 0;
let purchasedB = 0;
let purchasedC = 0;

// Initial costs for the upgrades
const costs = {
  A: 10,
  B: 100,
  C: 1000,
};

// Create a button element for clicking to increase counter
const clickButton: HTMLButtonElement = document.createElement("button");
clickButton.textContent = "👻";
clickButton.style.padding = "15px 30px";
clickButton.style.fontSize = "25";
clickButton.style.backgroundColor = "#007BFF";

clickButton.onmouseover = function () {
  clickButton.style.backgroundColor = "#0056b3";
};

clickButton.onmouseout = function () {
  clickButton.style.backgroundColor = "#007BFF";
};

clickButton.addEventListener("click", function () {
  counter++;
  updateCounterDisplay();
  updateUpgradeButtonsState();
});

app.append(clickButton);

// Define upgrade items
const upgrades = [
  { name: "A", growthIncrease: 0.1 },
  { name: "B", growthIncrease: 2.0 },
  { name: "C", growthIncrease: 50.0 },
];

// Create buttons for each upgrade
const upgradeButtons: HTMLButtonElement[] = upgrades.map((upgrade) => {
  const button = document.createElement("button");
  button.textContent = `Purchase Upgrade ${upgrade.name} (${costs[upgrade.name as keyof typeof costs].toFixed(2)} spooks)`;
  button.style.padding = "15px 30px";
  button.style.fontSize = "16px";
  button.style.color = "white";
  button.style.backgroundColor = "gray";
  button.style.margin = "10px";
  button.disabled = true;

  button.addEventListener("click", () => {
    const currentCost = costs[upgrade.name as keyof typeof costs];

    if (counter >= currentCost) {
      counter -= currentCost;
      growthRate += upgrade.growthIncrease;

      // Update the cost for the next purchase by increasing it by a factor of 1.15
      costs[upgrade.name as keyof typeof costs] *= 1.15;

      updateCounterDisplay();
      updateGrowthRateDisplay();
      updateItemsPurchased(upgrade.name);
      updateUpgradeButtonsState();
      updateUpgradeButtonLabels(); // Update the displayed cost on each button
    }
  });

  app.append(button);
  return button;
});

// Function to update the counter display
const updateCounterDisplay = () => {
  counterDiv.textContent = `${counter.toFixed(0)} spooks`;
};

// Function to update the growth rate display
const updateGrowthRateDisplay = () => {
  growthRateDiv.textContent = `Current Growth Rate: ${growthRate.toFixed(1)} spooks/sec`;
};

// Function to update the number of purchased items
const updateItemsPurchased = (itemName: string) => {
  if (itemName === "A") purchasedA++;
  if (itemName === "B") purchasedB++;
  if (itemName === "C") purchasedC++;
  itemsPurchasedDiv.textContent = `Items Purchased: A: ${purchasedA}, B: ${purchasedB}, C: ${purchasedC}`;
};

// Function to update the upgrade button labels with the new costs
const updateUpgradeButtonLabels = () => {
  upgradeButtons.forEach((button, index) => {
    const upgrade = upgrades[index];
    const currentCost = costs[upgrade.name as keyof typeof costs];
    button.textContent = `Purchase Upgrade ${upgrade.name} (${currentCost.toFixed(2)} spooks)`;
  });
};

// Function to enable/disable upgrade buttons based on the counter
const updateUpgradeButtonsState = () => {
  upgrades.forEach((upgrade, index) => {
    const button = upgradeButtons[index];
    const currentCost = costs[upgrade.name as keyof typeof costs];

    if (counter >= currentCost) {
      button.disabled = false;
      button.style.backgroundColor = "#28a745";
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
