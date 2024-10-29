console.log("p5.js version:", p5.version);
"use strict"; // Enables strict mode for better error catching and performance

//Variables
let fly;
let score = 0;
let frog;

function setup() {
    console.log("setup function is running");
    let canvas = createCanvas(640, 480); // Create a canvas of 640x480 pixels
    canvas.parent ('canvas-container');

  // Initialize the frog object with its properties
  frog = {
    body: {
      x: width / 2,      // Center horizontally
      y: height - 50,    // Near the bottom of the canvas
      size: 60
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
  drawFly();
  moveTongue();
  drawFrog();
  checkTongueFlyOverlap(); //continuously check for overlaps while the game is running
  drawScore();
}

 //Resets the fly's position randomly
function resetFly() {
  fly = {
    x: random(width),
    y: random(height - 100), // Keep fly away from the bottom where the frog is
    size: 20
  };
}

 //Draws the fly on the canvas
function drawFly() {
  push(); // Save current drawing style
  fill(0); // Black color
  ellipse(fly.x, fly.y, fly.size);
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

 //mousePressed function - runs when mouse is clicked
function mousePressed() {
  if (frog.tongue.state === "idle") {
    frog.tongue.state = "outbound";
    frog.tongue.targetX = mouseX;
    frog.tongue.targetY = mouseY;
  }
}
