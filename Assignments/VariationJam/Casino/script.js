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
    { emoji: '🦖', probability: 0.1 },
    { emoji: '🍇', probability: 0.8 }
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

// Function to trigger the drain animation
function triggerDrain() {
    drain.style('animation', 'drain 2s ease-in-out forwards'); // Start drain animation

    setTimeout(() => {
        waterOverlay.style('height', '0'); // Shrink water height
        waterOverlay.style('width', '0'); // Shrink water width
        waterOverlay.style('display', 'none'); // Hide water overlay
        
        setTimeout(() => {
            drain.style('display', 'none'); // Hide the drain
            drain.style('animation', 'none'); // Reset drain animation state
            isFlooding = false; // Allow future flooding events
        }, 2000);
    }, 2000);

    // Final alert once drain completes
    setTimeout(() => {
        alert("Would kill to play huh, interesting. Guess you can continue spinning now!");
    }, 5000);
}

let dinosaurs = [];  // Store dinosaur divs
let moveInterval;  // Store the interval ID for movement
let dinosaurBeingDragged = null;  // To track which dinosaur is being dragged
let offsetX = 0;  // To store the mouse offset for dragging
let offsetY = 0;  // To store the mouse offset for dragging


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
        alert("The dinosaurs are ESCAPING!! Better drag them back onto their island!");
        
        // After the alert, start the floating animation
        startDinosaurEscape();
        
        isFlooding = false; // Allow future actions
    }, 3050); // 3000ms for animation + 50ms initial delay
}

function startDinosaurEscape() {
    // Create dinosaur elements and append them to the body
    for (let i = 0; i < 3; i++) {
        let dinosaur = createDiv('🦖');
        dinosaur.style('position', 'absolute');
        dinosaur.style('font-size', '80px');
        dinosaur.style('top', random(0, height) + 'px');
        dinosaur.style('left', random(0, width) + 'px');
        dinosaurs.push(dinosaur);
        
        // Add mousePressed event to handle the drag start
        dinosaur.mousePressed(startDrag);
        
        // Add mouseReleased event to handle the drop
        dinosaur.mouseReleased(stopDrag);
    }

    // Start moving the dinosaurs at regular intervals
    moveInterval = setInterval(moveDinosaurs, 800); //Bigger the number slower they move
}

// Function to move the dinosaurs randomly
function moveDinosaurs() {
    dinosaurs.forEach(dinosaur => {
        if (!dinosaur.hasClass('frozen')) { 
            // Skip moving if the dinosaur is frozen
            let newX = random(0, width);
            let newY = random(0, height);
            dinosaur.style('top', newY + 'px');
            dinosaur.style('left', newX + 'px');
        }
    });
}

// Function to handle when a dinosaur starts being dragged
function startDrag() {
    dinosaurBeingDragged = this;  // Set the dinosaur that is being dragged
    offsetX = mouseX - parseFloat(dinosaurBeingDragged.style('left'));  // Calculate the offset for dragging
    offsetY = mouseY - parseFloat(dinosaurBeingDragged.style('top'));  // Calculate the offset for dragging
    dinosaurBeingDragged.style('z-index', '100');  // Bring the dinosaur to the front while dragging
    cursor(grab);
}

// Function to handle the dragging motion
function mouseDragged() {
    if (dinosaurBeingDragged) {
        let newX = mouseX - offsetX;  // Calculate new X position based on mouse position and offset
        let newY = mouseY - offsetY;  // Calculate new Y position based on mouse position and offset
        dinosaurBeingDragged.style('left', newX + 'px');  // Update the dinosaur's X position
        dinosaurBeingDragged.style('top', newY + 'px');   // Update the dinosaur's Y position
    }
}

// Function to stop the dragging and check if the dinosaur is dropped on the island
let frozenDinosaurs = 0;  // Counter to track how many dinosaurs are frozen in the oval

// Function to stop dragging and check if the dinosaur is dropped on the island
function stopDrag() {
    if (dinosaurBeingDragged) {
        // Island (oval) center and dimensions
        let islandX = width;
        let islandY = height;
        let islandRadius = 300; // Adjusted for circular distance detection

        // Get dinosaur's current center position
        let dinoX = mouseX;
        let dinoY = mouseY;

        // Check if the dinosaur is inside the oval area
        let distance = dist(dinoX, dinoY, islandX, islandY);
        if (distance < islandRadius) {
                 // Successfully placed on the island
             dinosaurBeingDragged.style('left', `${islandX - 40}px`); // Center the dinosaur
             dinosaurBeingDragged.style('top', `${islandY - 40}px`);
             dinosaurBeingDragged.style('z-index', '1');
             dinosaurBeingDragged.addClass('permanently-frozen'); // Add frozen class to prevent dragging
        
             frozenDinosaurs++;
    
             console.log(`Frozen dinosaurs: ${frozenDinosaurs}`); // Debug logrozenDinosaurs++; // Increment the counter
        
            if (frozenDinosaurs === 3) {
                setTimeout(() => {
                    alert("All dinosaurs have been returned to the island! Nothing can stop me from spinning now!");
                    triggerbackgrounddrain(); // Trigger the drain
                    resetGame(); // Reset game state
                }, 1000);
            } 
        }
     }
        dinosaurBeingDragged = null; // Clear dragging state
    }

function triggerbackgrounddrain() {
    console.log("Draining background triggered"); // Debugging log

    // Select the background flood overlay
    let backgroundFlood = select('#background-flood');
    if (!backgroundFlood) {
        console.error("Background flood element not found!"); // Error log if not present
        return;
    }

    // Trigger the drain animation
    backgroundFlood.style('animation', 'drain 2s ease-in-out forwards');

    setTimeout(() => {
        backgroundFlood.style('height', '0'); // Shrink height to simulate draining
        backgroundFlood.style('width', '0'); // Shrink width to simulate draining
        backgroundFlood.style('display', 'none'); // Hide the element after animation

        setTimeout(() => {
            backgroundFlood.style('animation', 'none'); // Reset animation for reuse
            isFlooding = false; // Allow future flooding events
            console.log("Background flooding successfully drained"); // Confirmation log
        }, 2000); // Allow the reset after the animation completes
    }, 2000); // Start shrinking after the drain animation
}



// Function to reset the game state after all dinosaurs are frozen and the water drains
function resetGame() {
    console.log("Game reset triggered");
    dinosaurs.forEach(dino => dino.remove());
    dinosaurs = [];
    frozenDinosaurs = 0;
    reels = [];
    for (let i = 0; i < 3; i++) {
        reels.push(getRandomSymbol());
    }
}