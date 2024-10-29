console.log("p5.js version:", p5.version);
"use strict"; // Enables strict mode for better error catching and performance

//Variables
let fly; // Object to represent the fly
let score = 0; // Player's score
let frog; // Object to represent the frog
let lastFlyMoveTime = 0; // Timestamp of the last fly movement
let flyMoveInterval = 1000; // Move fly every 1000 milliseconds (1 second)

function setup() {
    console.log("setup function is running");
    let canvas = createCanvas(640, 480); // Create a canvas of 640x480 pixels
    canvas.parent ('canvas-container'); // Attach the canvas to the HTML element with id 'canvas-container'

  // Initialize the frog object with its properties
  frog = {
    body: {
      x: width / 2,      // Center horizontally
      y: height - 50,    // Near the bottom of the canvas
      size: 60          // Size of the frog's body
    },
    tongue: {
      x: width / 2,
      y: height - 50,
      targetX: undefined,
      targetY: undefined,
      size: 10,
      speed: 5,
      state: "idle" // State can be: idle, outbound, inbound
    }
  };
    resetFly(); // Initialize the fly's position
}

function draw() {
  console.log("draw function is running");  
  background("#87ceeb"); // Set sky-blue background
  moveFly(); // Update the fly's position randomly
  drawFly(); // Draw the fly on the canvas
  moveTongue(); // Handle tongue movement
  drawFrog(); // Draw the frog on the canvas
  checkTongueFlyOverlap(); // Check if the tongue has caught the fly
  drawScore(); // Display the current score
}

 //Resets the fly's position randomly within bounds
function resetFly() {
  fly = {
    x: random(width), // Random x position within canvas width
    y: random(height - 100), // Random y position -- keep fly away from the bottom where the frog is
    size: 20, //Size of fly
    speed: 2 // Speed of fly movement (moveFly function)
  };
}

// Moves the fly randomly within bounds at specified intervals
function moveFly() {
  // Move the fly randomly every flyMoveInterval milliseconds
  if (millis() - lastFlyMoveTime > flyMoveInterval) {
      fly.x += random(-fly.speed, fly.speed); // Randomly adjust x position by speed amount
      fly.y += random(-fly.speed, fly.speed); // Randomly adjust y position by speed amount
      
  // Keep the fly within the canvas bounds using constrain function
      fly.x = constrain(fly.x, 0, width); 
      fly.y = constrain(fly.y, 0, height - 100); 
        
      lastFlyMoveTime = millis(); // Update last move time to current time
    }
}




 //Draws the fly on the canvas
function drawFly() {
  push(); // Save current drawing style
  fill(0); // Black color
  ellipse(fly.x, fly.y, fly.size); //Draw a circle 
  pop(); // Restore previous drawing style
}

//Draws the frog and its tongue
function drawFrog() {
  push();
  // Draw tongue
  stroke("#ff0000");
  strokeWeight(frog.tongue.size);
  line(frog.body.x, frog.body.y, frog.tongue.x, frog.tongue.y);
  
  // Draw tongue tip
  fill("#ff0000");
  noStroke();
  ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
  
  // Draw frog body
  fill("#00ff00");
  ellipse(frog.body.x, frog.body.y, frog.body.size);
  
  // Draw eyes
  fill(255); // White
  ellipse(frog.body.x - 15, frog.body.y - 10, 20);
  ellipse(frog.body.x + 15, frog.body.y - 10, 20);
  fill(0); // Black
  ellipse(frog.body.x - 15, frog.body.y - 10, 10);
  ellipse(frog.body.x + 15, frog.body.y - 10, 10);
  pop();
}


//Handles the movement of the frog's tongue
function moveTongue() {
    if (frog.tongue.state === "idle") {
      // Keep tongue at frog's position when idle
      frog.tongue.x = frog.body.x;
      frog.tongue.y = frog.body.y;
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
      let dy = frog.body.y - frog.tongue.y;
      let distance = dist(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
      
      if (distance > frog.tongue.speed) {
        // Move towards frog
        frog.tongue.x += (dx / distance) * frog.tongue.speed;
        frog.tongue.y += (dy / distance) * frog.tongue.speed;
      } else {
        // Reached frog, become idle
        frog.tongue.x = frog.body.x;
        frog.tongue.y = frog.body.y;
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