
let reels = [];
let symbols = ['🐟', '🐟', '🐟', '🐟', '🐟','🍇'];
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
    
    setTimeout(() => {
        drain.style('display', 'block');
        drain.style('animation', 'drain 4s ease-in-out forwards');
        
        setTimeout(() => {
            waterOverlay.style('height', '0');
            waterOverlay.style('width', '0'); // Reset width back to 0
            
            setTimeout(() => {
                drain.style('display', 'none');
                drain.style('animation', 'none');
                isFlooding = false;
            }, 2000);
        }, 2000);
    }, 3000);
}
