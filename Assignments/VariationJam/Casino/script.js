let reels = [];
let spinning = false;  // Flag to track if the reels are spinning
let spinButton;  
let isFlooding = false;  // Flag to track if water flooding is active
let waterOverlay;  
let drain; 
let fishClicks = [0, 0, 0];  // Array to track the number of clicks on each fish

// Set up the initial state
function setup() {
    let canvas = createCanvas(300, 300);  // Create a 300x300 canvas
    canvas.parent('canvas-container');  // Set the canvas to be inside the HTML container

    // Initialize the reels with random symbols
    for (let i = 0; i < 3; i++) {
        reels.push(getRandomSymbol());
    }

    // Set up the spin button and bind the spin function to it
    spinButton = select('#spin-button');
    spinButton.mousePressed(spin);

    // Set up references to the water overlay and drain elements
    waterOverlay = select('#water-overlay');
    drain = select('#drain');

    // Create an emoji container and set it inside the canvas container
    let emojiContainer = createDiv('').id('emoji-container');
    emojiContainer.parent('canvas-container');
}

// Function to update the canvas on each frame
function draw() {
    // Draw a dark green oval in the center (representing the slot area)
    fill(99,148,44);
    noStroke();
    ellipse(width / 2, height / 2, 330, 330);

    // Draw the symbols on the reels
    textSize(50);
    textAlign(CENTER, CENTER);
    fill(255);

    for (let i = 0; i < 3; i++) {
        let fishColor = (fishClicks[i] >= 3) ? color(255, 0, 0) : color(255);  // Change colour to red when fish is clicked 3 times
        fill(fishColor);
        text(reels[i], width / 3 * i + width / 6, height / 2);  // Position the fish symbols
    }

    // If spinning, update the reels every 5 frames
    if (spinning && frameCount % 5 === 0) {
        for (let i = 0; i < 3; i++) {
            reels[i] = getRandomSymbol();  // Randomly select new symbols
        }
    }
}

// Define the symbols and their probabilities
const symbols = [
    { emoji: '🐟', probability: 0.1 },
    { emoji: '🦖', probability: 0.8 },
    { emoji: '🍇', probability: 0.01 }
];

// Function to get a random symbol for the reels
function getRandomSymbol() {
    const randomValue = Math.random();
    let cumulativeProbability = 0;

    for (let symbol of symbols) {
        cumulativeProbability += symbol.probability;
        if (randomValue < cumulativeProbability) {
            return symbol.emoji;
        }
    }

    // Fallback in case probabilities don't sum to 1
    return symbols[symbols.length - 1].emoji;
}

// Function to handle the spin action
function spin() {
    if (!isFlooding) {
        spinning = true;
        spinButton.attribute('disabled', '');  // Disable the spin button during the spin

        // After 2 seconds, stop the spinning, re-enable the spin button, and check for a win
        setTimeout(() => {
            spinning = false;
            spinButton.removeAttribute('disabled');  // Re-enable the spin button
            for (let i = 0; i < 3; i++) {
                reels[i] = getRandomSymbol();  // Update the reels with new symbols
            }
            checkWin();  // Check if there is a winning combination
        }, 2000);
    }
}

// Function to check if there is a winning combination (3 fish in a row)
function checkWin() {
    if (reels[0] === '🐟' && reels[1] === '🐟' && reels[2] === '🐟') {
        startFlooding();  // If there is a win, start flooding the water
    }
    else if (reels[0] === '🦖' && reels[1] === '🦖' && reels[2] === '🦖') {
        startBackgroundFlooding(); // Trigger background flooding animation
    }    
}

// Function to start flooding the water (trigger water animation)
function startFlooding() {
    isFlooding = true;
    waterOverlay.style('height', '370px');  // Set height of the water to match the oval's height
    waterOverlay.style('width', '380px');  // Set width of the water to match the oval's width

    // Delay the alert message for 3 seconds (3000 milliseconds)
    setTimeout(() => {
        alert("These stinkin' fishes won't let me play, guess I can kill them!?");  // Show alert after 3 seconds
    }, 3000); // Delay of 3000 milliseconds (3 seconds)
}

function startBackgroundFlooding() {
    isFlooding = true; // Prevent other floods

    // Create the flood overlay if it doesn't already exist
    let backgroundFlood = select('#background-flood');
    if (!backgroundFlood) {
        backgroundFlood = createDiv('').id('background-flood');
        backgroundFlood.parent(document.body);
    }

    // Reset initial state
    backgroundFlood.style('height', '0');
    backgroundFlood.style('display', 'block');

    // Trigger the flooding animation
    setTimeout(() => {
        backgroundFlood.style('height', '100vh');
    }, 50);

    // Show alert after the animation finishes
    setTimeout(() => {
        alert("The dinosaurs took over! The background is flooding!");
        isFlooding = false; // Allow future actions
    }, 3050); // 3000ms for animation + 50ms initial delay
}



// Function to handle the mouse click event
function mousePressed() {
    for (let i = 0; i < 3; i++) {
        // Check if the mouse is within the bounds of the fish (based on its position and size)
        let fishX = width / 3 * i + width / 6;
        let fishY = height / 2;
        if (dist(mouseX, mouseY, fishX, fishY) < 50 && reels[i] === '🐟') {
            fishClicks[i]++;  // Increment the click counter for the clicked fish
            flashWater();  // Trigger water flash effect
            if (fishClicks[i] >= 3) {
                killFish(i);  // If the fish has been clicked 3 times, "kill" the fish
            }
        }
    }
}

// Function to trigger the red flash effect on the water when a fish is clicked
function flashWater() {
    waterOverlay.style('animation', 'flashRed 0.5s ease-in-out');  // Trigger the red flash effect
    setTimeout(() => {
        waterOverlay.style('animation', 'none');  // Reset the animation after the flash
    }, 500);
}

// Function to kill the fish (change it to a skull)
function killFish(fishIndex) {
    reels[fishIndex] = '💀';  // Change the fish emoji to a skull when it's "killed"
    if (fishClicks[0] >= 3 && fishClicks[1] >= 3 && fishClicks[2] >= 3) {
        triggerDrain();  // Trigger the drain action if all fish have been clicked 3 times
    }
}

// Function to trigger the drain animation (to empty the water)
function triggerDrain() {
    drain.style('display', 'block');  // Make the drain visible
    drain.style('animation', 'drain 2s ease-in-out forwards');  // Trigger the drain animation

    setTimeout(() => {
        waterOverlay.style('height', '0');  // Set water height to 0 to simulate draining
        waterOverlay.style('width', '0');  // Set water width to 0 to simulate draining
        
        setTimeout(() => {
            drain.style('display', 'none');  // Hide the drain after the animation
            drain.style('animation', 'none');  // Reset the drain animation
            isFlooding = false;  // End the flooding state
        }, 2000);
    }, 2000);
    
    // Delay the alert message
    setTimeout(() => {
        alert("Would kill to play huh, interesting. Guess you can continue spinning now!");  // Show alert after 5 seconds when all fish are killed
    }, 5000);
}
