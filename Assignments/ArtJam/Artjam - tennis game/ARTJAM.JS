// Array to store all bubble objects
let bubbles = [];
// Player's score
let score = 0;

function setup() {
  createCanvas(400, 600); //setting dimensions
  // Create initial multiple bubbles; loops 10 times
  for (let i = 0; i < 10; i++) {
    //Inside the loop, this line creates a new Bubble object and adds it to the bubbles array.
    //new Bubble() creates a new instance of the Bubble class.
    //bubbles.push() adds this new bubble to the end of the bubbles array.
    bubbles.push(new Bubble());
  }
}



function draw() {
  // Set background color to light blue
  background(240, 248, 255);
  
  // Update and display each bubble
  for (let i = bubbles.length - 1; i >= 0; i--) {
    bubbles[i].move();
    bubbles[i].display();
    // Remove bubbles that have moved off screen and create new ones
    if (bubbles[i].isOffScreen()) {
      bubbles.splice(i, 1);
      bubbles.push(new Bubble());
    }
  }
  
  // Display score
  textSize(24);
  fill(70, 130, 180); // Steel Blue color
  text(`Score: ${score}`, 10, 30);
}

// Handle mouse clicks
function mousePressed() {
  for (let i = bubbles.length - 1; i >= 0; i--) {
    // Check if mouse click is inside a bubble
    if (bubbles[i].contains(mouseX, mouseY)) {
      score += 10; // Increase score
      bubbles.splice(i, 1); // Remove popped bubble
      bubbles.push(new Bubble()); // Add a new bubble
    }
  }
}

// Bubble class
class Bubble {
  constructor() {
    // Initialize bubble properties
    this.x = random(width);
    this.y = height + random(20, 100); // Start below the canvas
    this.size = random(20, 60);
    // Smaller bubbles move faster
    this.speed = map(this.size, 20, 60, 2, 1);
    // Random pastel color with some transparency
    this.color = color(random(100, 255), random(100, 255), random(100, 255), 200);
  }
  
  // Move the bubble upwards
  move() {
    this.y -= this.speed;
  }
  
  // Display the bubble
  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
    
    // Add a shine effect to make the bubble look more realistic
    fill(255, 255, 255, 100);
    ellipse(this.x - this.size/4, this.y - this.size/4, this.size/3);
  }
  
  // Check if a point is inside the bubble
  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.size / 2;
  }
  
  // Check if the bubble has moved off the top of the screen
  isOffScreen() {
    return this.y < -this.size;
  }
}