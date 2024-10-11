import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Yahli's Incremental Game";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

let counter: number = 0;
const counterDiv: HTMLDivElement = document.createElement("div");
counterDiv.textContent = `${counter} spooks`;
app.append(counterDiv);

const button: HTMLButtonElement = document.createElement("button");
button.textContent = "👻";
button.style.padding = "15px 80px";
button.style.fontSize = "30px";
app.append(button);

button.addEventListener("click", function () {
  counter++; // Increment the counter
  counterDiv.textContent = `${counter} spooks`; // Update the display
});

const updateCounterDisplay = () => {
  counterDiv.textContent = `${counter.toFixed(2)} cookies`; // Update the display with two decimal places
};

let lastTimestamp: number = 0;

// Animation loop using requestAnimationFrame
const animate = (timestamp: number) => {
    if (lastTimestamp !== 0) {
        const deltaTime = (timestamp - lastTimestamp) / 1000; // Time difference in seconds
        const increment = deltaTime; // Counter should increase by 1 unit per second
        counter += increment; // Increment the counter by the calculated value
        updateCounterDisplay(); // Update the display
    }

    lastTimestamp = timestamp; // Save the current timestamp for the next frame
    requestAnimationFrame(animate); // Request the next frame
};

// Start the animation loop
requestAnimationFrame(animate);
