let reels = [];
let symbols = ['🐟', '🐟', '🐟', '🐟', '🐟','🍇']; // More fish symbols
let spinning = false;
let spinButton;
let isFlooding = false;
let waterOverlay;
let drain;

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

    // Create emoji container
    let emojiContainer = createDiv('').id('emoji-container');
    emojiContainer.parent('canvas-container');
}

function draw() {
    background(178, 224, 178); // Light green for grass

    // Draw the oval container first
    fill(46, 139, 87); // Darker green color
    noStroke();
    ellipse(width / 2, height / 2, 280, 180); // Increase size to 250x150 (width x height)

    // Draw slot machine reels
    textSize(50);
    textAlign(CENTER, CENTER);
    fill(255); // Set text color to white

    for (let i = 0; i < 3; i++) {
        text(reels[i], width / 3 * i + width / 6, height / 2);
    }

    // Spinning animation
    if (spinning && frameCount % 5 === 0) {
        for (let i = 0; i < 3; i++) {
            reels[i] = getRandomSymbol();
        }
    }
}


function getRandomSymbol() {
    // 60% chance to get a fish
    if (random() < 0.6) {
        return '🐟';
    } else {
        // 40% chance to get other symbols
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
    waterOverlay.style('height', '100%');
    
    setTimeout(() => {
        drain.style('display', 'block');
        drain.style('animation', 'drain 2s ease-in-out forwards');
        
        setTimeout(() => {
            waterOverlay.style('height', '0');
            
            setTimeout(() => {
                drain.style('display', 'none');
                drain.style('animation', 'none');
                isFlooding = false;
            }, 2000);
        }, 2000);
    }, 3000);
}
