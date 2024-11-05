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
let gameState = "title"; // Can be "title", "playing", or "ending"
let maxScore = 10; // Set the maximum score to end the game

function preload() {
  // Load the background image
  backgroundImg = loadImage('assets/images/froglips.jpg');
}

function calculateEyePosition(eyeX, eyeY, targetX, targetY, maxDistance) {
  // Calculate the angle between the eye and the target
  let angle = atan2(targetY - eyeY, targetX - eyeX);
  // Calculate the distance between the eye and the target, but limit it to the maximum allowed distance
  let distance = min(dist(eyeX, eyeY, targetX, targetY), maxDistance);
  // Return the new position of the pupil
  return {
    x: eyeX + cos(angle) * distance,
    y: eyeY + sin(angle) * distance
  };
}
function setup() {
  let canvas = createCanvas(640, 480); // Create a canvas of 640x480 pixels
  canvas.parent ('canvas-container'); // Attach the canvas to the HTML element with id 'canvas-container'
  // Resize the background image to fit the canvas
  backgroundImg.resize(width, height);
  textFont('Courier');
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
    startY: height - 158, //tongue starting y position
    targetX: undefined,
    targetY: undefined,
    size: 20,
    speed: 8.6, // speed of tongue movement (higher # = faster)
    state: "idle" // State can be: idle, outbound, inbound
  },
  eyes: {
    color: "#e0ba01", // Default yellow color
    redDuration: 60, // Number of frames the eyes stay red
    redTimer: 0 // Timer to track how long eyes have been red
  }
}
  resetFly(); // Initialize the fly's position
  lastFlyMoveTime = millis(); // Initialize the last move time
}
function draw() {
  image(backgroundImg, 0, 0); // Draw the background image
  updateEyeColor(); // Update eye color
  drawFrog(); // Draw the frog on the canvas
  drawFly(); // Draw the fly on the canvas
  moveFly(); // Update the fly's position randomly
  moveTongue(); // Handle tongue movement
  checkTongueFlyOverlap(); // Check if the tongue has caught the fly
  drawScore(); // Display the current score
  //title and closing scene logic
  if (gameState === "title") {
    drawTitleScreen();
  } else if (gameState === "playing") {
    updateEyeColor();
    drawFrog();
    drawFly();
    moveFly();
    moveTongue();
    checkTongueFlyOverlap();
    drawScore();
    
    if (score >= maxScore) {
      gameState = "ending";
    }
  } else if (gameState === "ending") {
    drawEndingScreen();
  }
}

//Draws the frog and its tongue
function drawFrog() {
  push();   
   // Draw eyes
   fill(frog.eyes.color); // Use the current eye colour
   let leftEyeX = frog.body.x - 70;
   let rightEyeX = frog.body.x + 84;
   let eyeY = frog.body.y - 110;
   let eyeSize = 60;
   let pupilSize = 18;
   
   ellipse(leftEyeX, eyeY, eyeSize);
   ellipse(rightEyeX, eyeY, eyeSize);
   
   // Calculate pupil positions + target (mouse position)
   let maxPupilDistance = (eyeSize - pupilSize) / 4;
   let leftPupil = calculateEyePosition(leftEyeX, eyeY, mouseX, mouseY, maxPupilDistance);
   let rightPupil = calculateEyePosition(rightEyeX, eyeY, mouseX, mouseY, maxPupilDistance);
   
   // Draw pupils
   fill("#281f18"); // Blackish brown
   ellipse(leftPupil.x, leftPupil.y, pupilSize);
   ellipse(rightPupil.x, rightPupil.y, pupilSize);
   pop();

  // Draw tongue
  stroke("#f64a02");
  strokeWeight(frog.tongue.size * 0.5);
  line(frog.body.x, frog.tongue.startY, frog.tongue.x, frog.tongue.y);
  
  // Draw tongue tip
  fill("#f64a02");
  noStroke();
  ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size * 0.5);
}

//Draws the fly on the canvas
function drawFly() {
  fill("#487b64"); // fly green
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

 //Checks if the tongue has caught the fly
function checkTongueFlyOverlap() {
  let d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
  if (d < frog.tongue.size/2 + fly.size/2 && frog.tongue.state === "outbound") {
    resetFly();
    frog.tongue.state = "inbound";
    score++;

    // Turn eyes red
    frog.eyes.color = "#FF0000";
    frog.eyes.redTimer = frog.eyes.redDuration;
  }
}
// changing eye colour from yellow to red back to yellow
function updateEyeColor() {
  if (frog.eyes.redTimer > 0) {
    frog.eyes.redTimer--;
    if (frog.eyes.redTimer === 0) {
      frog.eyes.color = "#e0ba01"; // Return to default yellow color
    }
  }
}

 // Mouse pressed function - runs when mouse is clicked to shoot tongue towards mouse position
 function mousePressed() {
  if (gameState === "title") {
    gameState = "playing";
    resetGame();
  } else if (gameState === "playing") {
    if (frog.tongue.state === "idle") {
      frog.tongue.state = "outbound";
      frog.tongue.targetX = mouseX;
      frog.tongue.targetY = mouseY;
    }
  } else if (gameState === "ending") {
    gameState = "playing";
    resetGame();

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

// Score text + colour etc
function drawScore() {
  push();
  fill("#487b64");
  textSize(24);
  text(`Score: ${score}`, 10, 30);
  pop();
}

// Title screen + Instructions setup
function drawTitleScreen() {
  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(40);
  text("Gluttony The Frog", width/2, height/3);
  textSize(15);
  text("RibBitT! Click to direct my tongue and help me catch flies!", width/2, height/2);
  text("Catch " + maxScore + " flies to win!", width/2, height/2 + 40);
  textSize(10);
  text("Click to start", width/2, height*3/4);
  pop();
}


// Ending screen text
function drawEndingScreen() {
  push();
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(30);
  text("Game Over!", width/2, height/3);
  textSize(20);
  text("YUMMY RIBBITT! You caught " + score + " flies!", width/2, height/2);
  textSize(10);
  text("Click to play again", width/2, height*3/4);
  pop();
}