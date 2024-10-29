/**
 * frogfrog
 * Pippin Barr
 * 
 * A game of catching flies with your frog-tongue
 * 
 * Instructions:
 * - Move the frog with your mouse
 * - Click to launch the tongue
 * - Catch flies
 * 
 * Made with p5
 * https://p5js.org/
 */

"use strict"; //js mode declare at beginning

//fly randomized movement
const fly = document.getElementById('fly');
const maxX = window.innerWidth - 20; // Subtracting the width of the fly
const maxY = window.innerHeight - 20; // Subtracting the height of the fly

function moveFly() {
    // Generate a random x-coordinate within the maximum width (maxX)
    const x = Math.random() * maxX;

    // Generate a random y-coordinate within the maximum height (maxY)
    const y = Math.random() * maxY;

    // Set the position of the 'fly' element using the calculated coordinates
    fly.style.left = `${x}px`; // Move the fly to the new x position
    fly.style.top = `${y}px`;  // Move the fly to the new y position

    // Rotate the fly randomly
    const rotation = Math.random() * 360;
    fly.style.transform = `rotate(${rotation}deg)`;
}

// Move the fly every second
setInterval(moveFly, 1000);

// Initial position
moveFly();

// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 520,
        size: 150
    },
    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: 320,
        y: 520,
        targetX: undefined,
        targetY: undefined,
        size: 20,
        speed: 20,
        state: "idle" // State can be: idle, outbound, inbound
    }
}

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
}

function draw() {
    background("#87ceeb");
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    //continuously check for overlaps while the game is running
    checkTongueFlyOverlap()
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    if (frog.tongue.state === "idle") {
        // Keep the tongue at the frog's position when idle
        frog.tongue.x = frog.body.x;
        frog.tongue.y = frog.body.y;
    }
    else if (frog.tongue.state === "outbound") {
        // Move the tongue towards the target position
        let dx = frog.tongue.targetX - frog.tongue.x;
        let dy = frog.tongue.targetY - frog.tongue.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > frog.tongue.speed) {
            frog.tongue.x += (dx / distance) * frog.tongue.speed;
            frog.tongue.y += (dy / distance) * frog.tongue.speed;
        } else {
            // If we're close enough to the target, start moving back
            frog.tongue.x = frog.tongue.targetX;
            frog.tongue.y = frog.tongue.targetY;
            frog.tongue.state = "inbound";
        }
    }
    else if (frog.tongue.state === "inbound") {
        // Move the tongue back to the frog
        let dx = frog.body.x - frog.tongue.x;
        let dy = frog.body.y - frog.tongue.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > frog.tongue.speed) {
            frog.tongue.x += (dx / distance) * frog.tongue.speed;
            frog.tongue.y += (dy / distance) * frog.tongue.speed;
        } else {
            // If we're back at the frog, become idle
            frog.tongue.x = frog.body.x;
            frog.tongue.y = frog.body.y;
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill("#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();
}

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    // Get distance from tongue tip to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);

    // Check if it's an overlap
    const eaten = (d < frog.tongue.size/2 + fly.size/2);

    if (eaten) {
        // Reset the fly
        resetFly();
        
        // Bring back the tongue
        frog.tongue.state = "inbound";
        
    
    }
}
/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
        frog.tongue.targetX = mouseX;
        frog.tongue.targetY = mouseY;
    }
}

