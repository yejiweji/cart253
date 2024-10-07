// Game variables
let ballPosition;    // Object to store the ball's x and y position
let ballVelocity;    // Object to store the ball's speed and direction
let leftPaddleY;     // Y-position of the player-controlled left paddle
let rightPaddleY;    // Y-position of the computer-controlled right paddle
let playerScore = 0; // Player's score, starts at 0
let computerScore = 0; // Computer's score, starts at 0
let playerWins = 0;
let computerWins = 0;

// Constants (values that don't change)
const PADDLE_WIDTH = 10;  // Width of both paddles in pixels
const PADDLE_HEIGHT = 80; // Height of both paddles in pixels
const BALL_SIZE = 20;     // Diameter of the ball in pixels
const WINNING_SCORE = 10; // Set winning score cap

// This function runs once at the start of the game
function setup() {
  // 1. Create a canvas 800 pixels wide and 400 pixels high
  // 2. Put the canvas inside the 'game-container' div in our HTML
  let canvas = createCanvas(800, 400);
  canvas.parent('game-container');
  
  // Initialize the ball:
  // 1. Set its starting position to the center of the screen
  // 2. Set its initial velocity to zero (it will be set in resetBall())
  ballPosition = { x: width / 2, y: height / 2 };
  ballVelocity = { x: 0, y: 0 };
  resetBall();
  
  // Set initial paddle positions:
  // 1. Calculate the vertical center of the screen
  // 2. Subtract half the paddle height to center the paddles
  leftPaddleY = height / 2 - PADDLE_HEIGHT / 2;
  rightPaddleY = height / 2 - PADDLE_HEIGHT / 2;

  resetGame();
}

// This function runs over and over, many times per second
function draw() {
  // 1. Fill the background with black to erase the previous frame
  background(0);
  
  // 2. Call all our game functions in order
  drawCourt();
  updatePaddles();
  updateBall();
  checkCollisions();
  checkScoring();
  drawGameElements();
}

// This function draws the line down the middle of the court
function drawCourt() {
  // 1. Set the line color to white
  // 2. Draw a line from the center top to bottom of the screen
  stroke(255);
  line(width/2, 0, width/2, height);
}

// This function updates the positions of both paddles
function updatePaddles() {
  // For the left paddle (player-controlled):
  // 1. mouseY gives us the current vertical position of the mouse
  // 2. subtract half the paddle height to center the paddle on the mouse
  // 3. constrain() keeps the paddle within the screen boundaries
  leftPaddleY = constrain(mouseY - PADDLE_HEIGHT / 2, 0, height - PADDLE_HEIGHT);
  
  // For the right paddle (computer-controlled):
  // 1. We set the target to be the same height as the ball
  // 2. subtract half the paddle height to center it on the ball
  // 3. constrain() keeps this paddle within the screen too
  let targetY = ballPosition.y - PADDLE_HEIGHT / 2;
  rightPaddleY = constrain(targetY, 0, height - PADDLE_HEIGHT);
}

// This function updates the ball's position
function updateBall() {
  // Move the ball by adding its velocity to its current position:
  // 1. Update the x-position
  // 2. Update the y-position
  ballPosition.x += ballVelocity.x;
  ballPosition.y += ballVelocity.y;
}

// This function checks if the ball has hit anything
function checkCollisions() {
  // Check for collision with top and bottom walls:
  // 1. If the ball's y-position is less than 0 (top) or greater than height (bottom)
  // 2. Reverse the ball's vertical direction
  if (ballPosition.y < 0 || ballPosition.y > height) {
    ballVelocity.y *= -1;
  }
  
  // Check for collision with left paddle:
  // 1. Check if the ball is at the left edge
  // 2. Check if the ball is within the vertical range of the paddle
  // 3. If both are true, reverse the ball's horizontal direction
  if (ballPosition.x < PADDLE_WIDTH && 
      ballPosition.y > leftPaddleY && 
      ballPosition.y < leftPaddleY + PADDLE_HEIGHT) {
    ballVelocity.x *= -1;
  }
  
  // Check for collision with right paddle:
  // (Similar to left paddle, but check the right edge)
  if (ballPosition.x > width - PADDLE_WIDTH && 
      ballPosition.y > rightPaddleY && 
      ballPosition.y < rightPaddleY + PADDLE_HEIGHT) {
    ballVelocity.x *= -1;
  }
}

// This function checks if anyone has scored
function checkScoring() {
  // Check if the ball has gone past the left edge (computer scores):
  // 1. If the ball's x-position is less than 0, increase the computer's score
  // 2. Reset the ball to the center
  if (ballPosition.x < 0) {
    computerScore++;
    if (computerScore >= WINNING_SCORE) {
      gameOver("Computer");
    } else {
      resetBall();
    }
  }
  // Check if the ball has gone past the right edge (player scores):
  // 1. If the ball's x-position is greater than the screen width, increase the player's score
  // 2. Reset the ball to the center
  if (ballPosition.x > width) {
    playerScore++;
    if (playerScore >= WINNING_SCORE) {
      gameOver("Player");
    } else {
      resetBall();
    }
  }
} 

// outputs a winner text to show game is over
function gameOver(winner) {
  noLoop();
  
  if (winner === "Player") {
      playerWins++;
  } else {
      computerWins++;
  }
  
  updateWinTracker();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(64);
  text(winner + " dominates!", width/2, height/2);
  
  textSize(32);
  text("Click to play again", width/2, height/2 + 50);
}

function mouseClicked() {
  // If the game is over (i.e., the draw loop is stopped), restart the game by clicking
  if (!isLooping()) {
    resetGame();
    loop();
  }
}

// This function draws the visible elements of the game
function drawGameElements() {
  // Set up the drawing settings:
  fill(255); //Set the fill color to white
  noStroke(); //Don't draw outlines on shapes
  
  // Draw the paddles:
  // 1. Draw the left paddle (x=0, y=leftPaddleY)
  // 2. Draw the right paddle (x=width-PADDLE_WIDTH, y=rightPaddleY)
  rect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  rect(width - PADDLE_WIDTH, rightPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
  
  // Draw the ball:
  // Use ellipse() to draw a circle for the ball's position
  ellipse(ballPosition.x, ballPosition.y, BALL_SIZE);
  
  // Display scores:
  textSize(32);   // Set text size to 32 pixels
  textAlign(LEFT, TOP);
  text(playerScore, 10, 10); //Draw player's score
  textAlign(RIGHT, TOP);
  text(computerScore, width - 10, 10); //Draw computer's score
}

//Win tracker point adding system
//Find the HTML element with id 'xx-wins' and set its text content to the current value 
function updateWinTracker() {
  document.getElementById('player-wins').textContent = playerWins; 
  document.getElementById('computer-wins').textContent = computerWins;
}

// This function resets the ball to the center with a random direction
function resetBall() {
  // Put the ball in the middle of the screen
  ballPosition.x = width / 2;
  ballPosition.y = height / 2;
  
  // Set a random horizontal direction (left or right)
  // random() gives a number between 0 and 1, If it's less than 0.5, set velocity to -4, otherwise 4
  ballVelocity.x = random() < 0.5 ? -4 : 4;
  
  // Set a random vertical direction (slightly up or down)
  // random(-3, 3) gives a number between -3 and 3
  ballVelocity.y = random(-3, 3);
}
// reposition all functions back for new game
function resetGame() {
  playerScore = 0;
  computerScore = 0;
  resetBall();
  leftPaddleY = height / 2 - PADDLE_HEIGHT / 2;
  rightPaddleY = height / 2 - PADDLE_HEIGHT / 2;
}