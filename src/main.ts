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

const counterDiv: HTMLDivElement = document.createElement("div");
counterDiv.textContent = `${counter.toFixed(0)} spooks`;
counterDiv.style.fontSize = "24px";
counterDiv.style.margin = "20px 0"; 

app.append(counterDiv);

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
    updateUpgradeButtonState(); 
});

app.append(clickButton);

// Create a button for purchasing the upgrade
const upgradeButton: HTMLButtonElement = document.createElement("button");
upgradeButton.textContent = "Purchase Upgrade (10 spooks)";
upgradeButton.style.padding = "15px 30px";
upgradeButton.style.fontSize = "16px";
upgradeButton.style.color = "white";
upgradeButton.style.backgroundColor = "gray";
upgradeButton.style.cursor = "not-allowed"; // Not clickable at start
upgradeButton.disabled = true; // Disable until user has 10 spooks

upgradeButton.addEventListener("click", function () {
    if (counter >= 10) {
        counter -= 10; // Deduct 10 spooks from the counter
        growthRate += 1; // Increase the growth rate by 1 unit/second
        updateCounterDisplay();
        updateUpgradeButtonState();
    }
});


app.append(upgradeButton);


const updateCounterDisplay = () => {
    counterDiv.textContent = `${counter.toFixed(0)} spooks`;
};


const updateUpgradeButtonState = () => {
    if (counter >= 10) {
        upgradeButton.disabled = false;
        upgradeButton.style.backgroundColor = "#28a745"; // Change color to indicate it's purchasable
        upgradeButton.style.cursor = "pointer"; // Allow clicks
    } else {
        upgradeButton.disabled = true;
        upgradeButton.style.backgroundColor = "gray"; // Disabled state
        upgradeButton.style.cursor = "not-allowed"; // Not clickable
    }
};

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
            updateUpgradeButtonState();
        }
    }

    lastTimestamp = timestamp;
    requestAnimationFrame(animate);
};


requestAnimationFrame(animate);
