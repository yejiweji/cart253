"strict"

let reels = [];
let symbols = ['🐟', '🐟', '🐟', '🐟', '🐟', '🍇'];
let spinning = false;
let spinButton;
let isFlooding = false;
let waterOverlay;
let drain;
let fishClicks = [0, 0, 0];  // To track the number of clicks on each fish

function setup() {
    let canvas = createCanvas(300, 300);
    canvas.parent('canvas-container');

    for (let i = 0; i < 3; i++) {
        reels.push(getRandomSymbol());
    }

    spinButton = select('#spin-button');
    spinButton.mousePressed(spin);

    waterOverlay = select('#water-overlay');
    drain = select('#drain');

    let emojiContainer = createDiv('').id('emoji-container');
    emojiContainer.parent('canvas-container');
}

function draw() {
    background(178, 224, 178); 

    fill(46, 139, 87);
    noStroke();
    ellipse(width / 2, height / 2, 280, 180);

    textSize(50);
    textAlign(CENTER, CENTER);
    fill(255);

    for (let i = 0; i < 3; i++) {
        let fishColor = (fishClicks[i] >= 3) ? color(255, 0, 0) : color(255);
        fill(fishColor);
        text(reels[i], width / 3 * i + width / 6, height / 2);
    }

    if (spinning && frameCount % 5 === 0) {
        for (let i = 0; i < 3; i++) {
            reels[i] = getRandomSymbol();
        }
    }
}

function getRandomSymbol() {
    if (random() < 0.6) {
        return '🐟';
    } else {
        return random(['🐟', '🐟', '🍇']);
    }
}

function spin() {
    if (!isFlooding) {
        spinning = true;
        spinButton.attribute('disabled', '');

        setTimeout(() => {
            spinning = false;
            spinButton.removeAttribute('disabled');
            for (let i = 0; i < 3; i++) {
                reels[i] = getRandomSymbol();
            }
            checkWin();
        }, 2000);
    }
}

function checkWin() {
    if (reels[0] === '🐟' && reels[1] === '🐟' && reels[2] === '🐟') {
        startFlooding();
    }
}

function startFlooding() {
    isFlooding = true;
    waterOverlay.style('height', '180px'); // Set height to match the oval's height
    waterOverlay.style('width', '280px'); // Set width to match the oval's width

    // Delay the alert message for 3 seconds (3000 milliseconds)
    setTimeout(() => {
        alert("These stinkin' fishes won't let me play, guess I'll kill them!?");
    }, 3000); // Delay of 3000 milliseconds (3 seconds)
}


function mousePressed() {
    for (let i = 0; i < 3; i++) {
        // Check if the mouse is within the bounds of the fish
        let fishX = width / 3 * i + width / 6;
        let fishY = height / 2;
        if (dist(mouseX, mouseY, fishX, fishY) < 50 && reels[i] === '🐟') {
            fishClicks[i]++;
            flashWater();  // Trigger water flash effect
            if (fishClicks[i] >= 3) {
                killFish(i);
            }
        }
    }
}

function flashWater() {
    // Trigger the red flash effect
    waterOverlay.style('animation', 'flashRed 0.5s ease-in-out');
    setTimeout(() => {
        waterOverlay.style('animation', 'none');  // Reset the animation
    }, 500);
}

function killFish(fishIndex) {
    reels[fishIndex] = '💀';  // Change the fish emoji to a skull
    if (fishClicks[0] >= 3 && fishClicks[1] >= 3 && fishClicks[2] >= 3) {
        triggerDrain();

    // Delay the alert message for 3 seconds (3000 milliseconds)
    setTimeout(() => {
        alert("Whew! Now back to spinning!");
    }, 5000);
    
    }
}

function triggerDrain() {
    drain.style('display', 'block');
    drain.style('animation', 'drain 2s ease-in-out forwards');

    setTimeout(() => {
        waterOverlay.style('height', '0');
        waterOverlay.style('width', '0'); // Reset width back to 0
        
        setTimeout(() => {
            drain.style('display', 'none');
            drain.style('animation', 'none');
            isFlooding = false;
        }, 2000);
    }, 2000);
}
