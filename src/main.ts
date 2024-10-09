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