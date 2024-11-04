"use strict"; // Enables strict mode for better error catching and performance

//Variables
let fly; // Object to represent the fly
let score = 0; // Player's score
let frog; // Object to represent the frog
let lastFlyMoveTime = 0; // Timestamp of the last fly movement
let flyMoveInterval = 50; // Move fly every 1000 milliseconds (1 second)
let flyPauseTime = 0;
let flyPauseDuration = 180; // Pause for 180 ms
let backgroundImg;

function preload() {
  // Load the background image
  backgroundImg = loadImage('assets/images/froglips.jpg');
}

function draw() {
  image(backgroundImg, 0, 0); // Draw the background image
  drawFrog(); // Draw the frog on the canvas
  drawFly(); // Draw the fly on the canvas
  moveFly(); // Update the fly's position randomly
  moveTongue(); // Handle tongue movement
  checkTongueFlyOverlap(); // Check if the tongue has caught the fly
  drawScore(); // Display the current score
}

function setup() {
    let canvas = createCanvas(640, 480); // Create a canvas of 640x480 pixels
    canvas.parent ('canvas-container'); // Attach the canvas to the HTML element with id 'canvas-container'
    // Resize the background image to fit the canvas
    backgroundImg.resize(width, height);
    // Initialize the frog object with its properties
  frog = {
    body: {
      x: width / 2,      // Center horizontally
      y: height / 2,    // Center vertically
      size: 400          // Size of the frog's body
    },
    tongue: {
      x: width / 2,
      y: height - 50,
      startY: height - 156, //tongue starting y position
      targetX: undefined,
      targetY: undefined,
      size: 30,
      speed: 9, // speed of tongue movement (higher # = faster)
      state: "idle" // State can be: idle, outbound, inbound
    }
  };
    resetFly(); // Initialize the fly's position
    lastFlyMoveTime = millis(); // Initialize the last move time

}

//Draws the frog and its tongue
function drawFrog() {
  push();  
  // // Draw frog body placeholder
  // fill("#00ff00");
  // ellipse(frog.body.x, frog.body.y, frog.body.size);
  
  // Draw eyes
  fill("#dbba04"); // Yellow
  ellipse(frog.body.x - 78, frog.body.y - 110, 80);
  ellipse(frog.body.x + 84, frog.body.y - 110, 80);
  fill(0); // Black
  ellipse(frog.body.x - 78, frog.body.y - 110, 20);
  ellipse(frog.body.x + 84, frog.body.y - 110, 20);
  pop();
  
   // Draw tongue
  stroke("#ff0000");
  strokeWeight(frog.tongue.size * 0.5);
  line(frog.body.x, frog.tongue.startY, frog.tongue.x, frog.tongue.y);
  
  // Draw tongue tip
  fill("#ff0000");
  noStroke();
  ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size * 0.68);
}

//Draws the fly on the canvas
function drawFly() {
  fill(0); // Black color
  ellipse(fly.x, fly.y, fly.size/2); //Draw a circle 
}
function moveFly() {
  let currentTime = millis();
  if (currentTime - lastFlyMoveTime > flyMoveInterval) {
    lastFlyMoveTime = currentTime;

    console.log("Fly state:", fly.state);
    console.log("Fly position:", fly.x, fly.y);
    console.log("Fly target:", fly.targetX, fly.targetY);

    if (fly.state === "moving") {
      // Calculate direction to target
      let dx = fly.targetX - fly.x;
      let dy = fly.targetY - fly.y;
      let distance = dist(fly.x, fly.y, fly.targetX, fly.targetY);

      if (distance > fly.speed) {
        // Move towards the target
        fly.x += (dx / distance) * fly.speed;
        fly.y += (dy / distance) * fly.speed;
      } else {
        // Reached the target, decide whether to pause or set a new target
        if (random() < 0.3) { // 30% chance to pause
          fly.state = "paused";
          flyPauseTime = currentTime;
        } else {
          // Set a new random target
          fly.targetX = random(width);
          fly.targetY = random(height - 100);
        }
      }
    } else if (fly.state === "paused") {
      // Check if pause duration has elapsed
      if (currentTime - flyPauseTime > flyPauseDuration) {
        fly.state = "moving";
        fly.targetX = random(width);
        fly.targetY = random(height - 100);
      }
      
    }
    // Ensure the fly stays within the canvas boundaries
    fly.x = constrain(fly.x, 0, width);
    fly.y = constrain(fly.y, 0, height - 100);

  }
}

//Handles the movement of the frog's tongue
function moveTongue() {
    if (frog.tongue.state === "idle") {
      // Keep tongue at frog's position when idle
      frog.tongue.x = frog.body.x;
      frog.tongue.y = frog.tongue.startY;
    } else if (frog.tongue.state === "outbound") {
      // Move tongue towards the target
      let dx = frog.tongue.targetX - frog.tongue.x;
      let dy = frog.tongue.targetY - frog.tongue.y;
      let distance = dist(frog.tongue.x, frog.tongue.y, frog.tongue.targetX, frog.tongue.targetY);
      
      if (distance > frog.tongue.speed) {
        // Move towards target
        frog.tongue.x += (dx / distance) * frog.tongue.speed;
        frog.tongue.y += (dy / distance) * frog.tongue.speed;
      } else {
        // Reached target, start retracting
        frog.tongue.x = frog.tongue.targetX;
        frog.tongue.y = frog.tongue.targetY;
        frog.tongue.state = "inbound";
      }
    } else if (frog.tongue.state === "inbound") {
      // Retract tongue back to frog
      let dx = frog.body.x - frog.tongue.x;
      let dy = frog.tongue.startY - frog.tongue.y;
      let distance = dist(frog.tongue.x, frog.tongue.y, frog.body.x, frog.tongue.startY);
      
      if (distance > frog.tongue.speed) {
        // Move towards frog
        frog.tongue.x += (dx / distance) * frog.tongue.speed;
        frog.tongue.y += (dy / distance) * frog.tongue.speed;
      } else {
        // Reached frog, become idle
        frog.tongue.x = frog.body.x;
        frog.tongue.y = frog.tongue.startY;
        frog.tongue.state = "idle";
      }
    }
  }

/**
 * Checks if the tongue has caught the fly
 */
function checkTongueFlyOverlap() {
  let d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
  if (d < frog.tongue.size/2 + fly.size/2 && frog.tongue.state === "outbound") {
    resetFly();
    frog.tongue.state = "inbound";
    score++;
  }
}

function drawScore() {
    push();
    fill(0);
    textSize(24);
    text(`Score: ${score}`, 10, 30);
    pop();
  }

 // Mouse pressed function - runs when mouse is clicked to shoot tongue towards mouse position
function mousePressed() {
  if (frog.tongue.state === "idle") { // Only shoot if tongue is idle
      frog.tongue.state = "outbound"; // Change state to outbound to indicate movement towards target
      frog.tongue.targetX = mouseX;   // Set target X position to mouse X coordinate 
      frog.tongue.targetY = mouseY;   // Set target Y position to mouse Y coordinate 
  }
}

//Resets the fly's position randomly within bounds
function resetFly() {
  fly = {
    x: random(width), // Random x position within canvas width
    y: random(height - 100), // Random y position -- keep fly away from the bottom where the frog is
    size: 20, //Size of fly
    speed: random(1, 7.5), // Speed of fly movement (moveFly function)
    targetX: random(width),
    targetY: random(height - 100),
    state: "moving" // Can be "moving" or "paused"
  };
  lastFlyMoveTime = millis(); // Reset the last move time
}