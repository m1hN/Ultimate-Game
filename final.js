/* FUNCTIONS MODULE ASSIGNMENT
Demonstrating knowledge of functions with parameters and return values using the myCanvas
*/

// *** Don't forget to add your graphics and random libraries! ***

// Canvas setup
let cnv = document.getElementById("myCanvas");
let ctx = cnv.getContext("2d");
cnv.width = 700;
cnv.height = 700;

let btn = document.getElementById("btn");

// Do not add/remove code from this section:
// ***************************************************
// Global Vars

let showObstacle = true;
let mouseX;
let mouseY;
let aDown;
let dDown;
let sDown;
let wDown;
let eDown;
let mouseDown;
let gameIsOver = false;
let opaque = 0.5;
let allLaser = [];
let allRocketLaser = [];
let allObjects = [];
let score = 0;
let enemyKilled = 0;
let timeLived = 0;
let frame = 0;
let framePause;
let fireballOn = false;
let dragonFireBallOn = false;
let opacity = 1 / 3;
let rand;
let trueGameOver;
let dragonY = 0;
let dragonYSpeed = 0.5;
let dragonMouthY = 0;
let dragonMouthYSpeed = 0.5;
let dragonEarY = 0;
let dragonEarYSpeed = 0.5;

// Variables

let sprite = {
  x: 250,
  y: 250,
  width: 10,
  height: 10,
};

// Hitbox
let rocketHitBox = {
  x: 295,
  y: 475,
  width: 110,
  height: 130,
};

let aFireBall = {
  x: rand,
  y: 0,
  width: 100,
  height: cnv.height,
};

let aDragonFireBall = {
  x: 300,
  y: 0,
  width: 100,
  height: cnv.height,
};

for (let i = 0; i < 20; i++) {
  allObjects.push(getObject());
}

requestAnimationFrame(drawScene);

function drawScene() {
  // Runs Game
  runGame();

  requestAnimationFrame(drawScene);
}

// HELPER FUNCTIONS

btn.addEventListener("click", btnClicked);

//   Keyboard handler
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("keypress", keyboardHandler);

// mouse movement listener
cnv.addEventListener("mousemove", mousemoveHandler);
cnv.addEventListener("mousedown", mousedownHandler);
cnv.addEventListener("mouseup", mouseupHandler);

// Functions

function btnClicked() {
  reset();
}

function mousemoveHandler(event) {
  let rect = cnv.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
}

function mousedownHandler(event) {
  mouseDown = true;
}

function mouseupHandler(event) {
  mouseDown = false;
}

function quadrants() {
  let rand = Math.random() * 10;

  if (rand < 2.5) {
    return "1";
  } else if (rand < 5) {
    return "2";
  } else if (rand < 7.5) {
    return "3";
  } else if (rand < 10) {
    return "4";
  }
}

function collision(object) {
  if (
    mouseX > object.x - object.radius &&
    mouseX < object.x + object.radius &&
    mouseY > object.y - object.radius &&
    mouseY < object.y + object.radius
  ) {
    increaseScore(10);
    enemyKilled++;
    return true;
  } else {
    return false;
  }
}

function keydownHandler(event) {
  if (event.code == "KeyS") {
    sDown = true;
  }
  if (event.code == "KeyA") {
    aDown = true;
  }
  if (event.code == "KeyD") {
    dDown = true;
  }
  if (event.code == "KeyW") {
    wDown = true;
  }

  if (event.code == "KeyE") {
    eDown = true;
  }
}

function mouseCoordinate(event) {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  return [mouseX, mouseY];
}

function keyupHandler(event) {
  if (event.code == "KeyS") {
    sDown = false;
  }
  if (event.code == "KeyA") {
    aDown = false;
  }
  if (event.code == "KeyD") {
    dDown = false;
  }
  if (event.code == "KeyW") {
    wDown = false;
  }
  if (event.code == "KeyE") {
    eDown = false;
  }
}

function keyboardHandler(event) {
  if (event.code == "KeyA") {
  }
  if (event.code == "KeyD") {
  }
  if (event.code == "KeyF") {
    opaque = 1;
  }
  if (event.code == "KeyC") {
    opaque = 0.5;
  }
}
// ***************************************************

// Thoughts

// Everything second half should be faster -> needs to feel climactic but fair

// Boss fight using lasers, dragon beams, enemys luanching tracking missiles +  more?

// Like usual, you can destroy tracking enemies with lazers, but to kill boss, you need to collect/launch back 5 of their own attacks at them

// The more enemies you kill in Minh's game, less spawn in the final game

// For boss, every 5 seconds, make eyes go up and rotate
// Boss bobs up and down

// Lazers move with the bosses hands

// These enemies can be shot, bots pellets can't

// If theres time, need to add more random obstacles + want to make asteroids spawn randomly

function runGame() {
  if (gameIsOver == true) {
    ctx.fillStyle = "midnightblue";
    ctx.fillRect(0, 0, cnv.width, cnv.height);
    //draw star
    ctx.fillStyle = "white";
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(allStars[i].x, allStars[i].y, allStars[i].r, 0, 2 * Math.PI);
      ctx.globalAlpha = allStars[i].o;
      ctx.fill();
    }
    for (let i = 0; i < allStars.length; i++) {
      allStars[i].y += allStars[i].dy;

      if (allStars[i].y - allStars[i].r >= cnv.height) {
        allStars[i].y = -allStars[i].r;
        allStars[i].x = Math.random() * cnv.width;
      }
    }

    // Rocket

    let rocketx = 0;
    let rockety = 0;

    if (wDown) {
      rockety -= 100;
      rockety = rockety;
    }
    if (sDown) {
      rockety += 100;
      rockety = rockety;
    }
    if (aDown) {
      rocketx -= 200;
      rocketx = rocketx;
    }
    if (dDown) {
      rocketx += 200;
      rocketx = rocketx;
    }

    ctx.globalAlpha = 1;

    if (showObstacle) {
      obstacleGenerator(randNum);
    }
    // Shoot Laser
    if (mouseDown) {
      shootRocketLaser(rocketHitBox);
    }
    drawRocket(rocketx, rockety);

    // Dragon's Fireballds
    if (frame % 150 == 0) {
      framePause = frame;
      dragonFireBallOn = !dragonFireBallOn;
    }
    if (dragonFireBallOn) {
      drawDragonFireBall();
      if (framePause < frame + 130) {
        opacity = 1 / 3;
      } else {
        opacity = 1;
      }
    } else {
      opacity = 1 / 3;
    }

    // Dragon

    drawDragon(dragonY, dragonMouthY, dragonEarY);
    dragonY += dragonYSpeed;
    dragonMouthY += dragonMouthYSpeed;
    dragonEarY += dragonEarYSpeed;
    drawHandLeft(0);
    drawHandRight(0);

    if (dragonY >= 50 || dragonY <= 0) {
      dragonYSpeed *= -1;
    }
    if (dragonMouthY >= 20 || dragonMouthY <= 0) {
      dragonMouthYSpeed *= -1;
    }
    if (dragonEarY >= 25 || dragonEarY <= 0) {
      dragonEarYSpeed *= -1;
    }

    // If Dragon Fireball Is Hit
    dragonFireBallHit(frame);

    frame--;
    if (trueGameOver) {
      gameOver();
    }
  } else {
    // Count Seconds
    frame++;
    if (frame % 60 == 0) {
      timeLived++;
    }

    if (!gameIsOver) {
      // Sprite Movement
      movement();

      // Redraw Background
      ctx.fillStyle = "brown";
      ctx.fillRect(0, 0, cnv.width, cnv.height);

      // Draw Sprite
      ctx.fillStyle = `rgba(0, 128, 255, ${opaque})`; // cabin base
      ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height);

      // Enemy Objects
      enemyObjects();
      // Fireball
      if (frame % 150 == 0) {
        rand = Math.random() * 500;

        framePause = frame;
        fireballOn = !fireballOn;
      }

      if (fireballOn) {
        drawFireBall();
        if (framePause > frame - 130) {
          opacity = 1 / 3;
        } else {
          opacity = 1;
        }
      } else {
        opacity = 1 / 3;
      }
      // Score
      ctx.font = "20px Arial";
      ctx.fillStyle = "white";
      ctx.fillText("Time Lived: " + timeLived + " sec", 30, 30);

      // Shoot Laser
      if (mouseDown) {
        shootLaser(sprite);
      }

      // Checks Collisions
      for (let i = 0; i < allObjects.length; i++) {
        checkCollisions(sprite, allObjects[i], frame);
      }

      // Checks when fireball hits
      fireBallHit(frame);
    }
  }
}

let rectY = 200;
let rectYspeed = 1;

function checkCollisions(sprite, object, frame) {
  if (
    (sprite.x + sprite.width > object.x - object.radius &&
      sprite.x + sprite.width < object.x + object.radius &&
      sprite.y + sprite.height > object.y - object.radius &&
      sprite.y + sprite.height < object.y + object.radius) ||
    (sprite.x + sprite.width > aFireBall.x - 100 &&
      sprite.x + sprite.width < aFireBall.x + 100 &&
      sprite.y + sprite.height > aFireBall.y - cnv.height &&
      sprite.y + sprite.height < aFireBall.y + cnv.height)
  ) {
    gameIsOver = true;
    console.log("Game Over");
  }
}

function fireBallHit(frame) {
  if (
    sprite.x + sprite.width > rand - 100 &&
    sprite.x + sprite.width < rand + 100 &&
    sprite.y + sprite.height > aFireBall.y - cnv.height &&
    sprite.y + sprite.height < aFireBall.y + cnv.height &&
    opacity == 1
  ) {
    if (frame % 10 == 0) {
      gameIsOver = true;
      console.log("Game Over");
    }
  }
}

function dragonMovement() {}

function dragonFireBallHit(frame) {
  console.log(
    `Rocket left: ${rocketHitBox.x < aDragonFireBall.x + aDragonFireBall.width}`
  );
  if (
    rocketHitBox.x + 295 + rocketHitBox.width > aDragonFireBall.x &&
    rocketHitBox.x + 295 < aDragonFireBall.x + aDragonFireBall.width &&
    opacity == 1
  ) {
    console.log("hit");
    if (frame % 10 == 0) {
      gameOver();
      trueGameOver = true;
      console.log("Game Over");
    }
  } else {
    console.log("did not hit");
  }
}

function drawDragon(y, dragonMouth, dragonEar) {
  ctx.fillStyle = "#4e4e94";
  ctx.beginPath();
  ctx.moveTo(264.5, 177 + y + dragonMouth);
  ctx.lineTo(264.5, 253 + y + dragonMouth);
  ctx.lineTo(350, 310 + y + dragonMouth);
  ctx.lineTo(435.5, 253 + y + dragonMouth);
  ctx.lineTo(435.5, 177 + y + dragonMouth);
  ctx.lineTo(264.5, 177 + y + dragonMouth);
  ctx.fill();
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.moveTo(100, 0 + y);
  ctx.lineTo(125.5, -95 + y);
  ctx.lineTo(189, -145 + y);
  ctx.lineTo(244.5, -110 + y);
  ctx.lineTo(350, -185 + y);
  ctx.lineTo(455.5, -110 + y);
  ctx.lineTo(511, -145 + y);
  ctx.lineTo(574.5, -95 + y);
  ctx.lineTo(650, 0 + y);
  ctx.lineTo(100, 0 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(50, 0 + y);
  ctx.lineTo(102, 92 + y);
  ctx.lineTo(155.5, 152 + y);
  ctx.lineTo(272.5, 181 + y);
  ctx.lineTo(275.5, 253 + y);
  ctx.lineTo(350, 300 + y);
  ctx.lineTo(424.5, 253 + y);
  ctx.lineTo(427.5, 181 + y);
  ctx.lineTo(554.5, 142 + y);
  ctx.lineTo(598, 92 + y);
  ctx.lineTo(650, 0 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(141.5, 132 + y + dragonEar);
  ctx.lineTo(18.5, 176 + y + dragonEar);
  ctx.lineTo(-50, 88 + y + dragonEar);
  ctx.lineTo(-50, -20 + y + dragonEar);
  ctx.lineTo(18.5, -128 + y + dragonEar);
  ctx.lineTo(141.5, -96 + y + dragonEar);
  ctx.lineTo(141.5, 132 + y + dragonEar);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(558.5, 132 + y + dragonEar);
  ctx.lineTo(681.5, 176 + y + dragonEar);
  ctx.lineTo(750, 88 + y + dragonEar);
  ctx.lineTo(750, -20 + y + dragonEar);
  ctx.lineTo(681.5, -128 + y + dragonEar);
  ctx.lineTo(558.5, -96 + y + dragonEar);
  ctx.lineTo(558.5, 132 + y + dragonEar);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.moveTo(226.5 - 110, 314 - 400 + y);
  ctx.lineTo(125.5 - 110, 287 - 400 + y);
  ctx.lineTo(72.5 - 110, 370 - 400 + y);
  ctx.lineTo(226.5 - 110, 390 - 400 + y);
  ctx.lineTo(226.5 - 110, 314 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(70.5 - 110, 489 - 400 + y);
  ctx.lineTo(125.5 - 110, 561 - 400 + y);
  ctx.lineTo(226.5 - 110, 526 - 400 + y);
  ctx.lineTo(226.5 - 110, 461 - 400 + y);
  ctx.lineTo(70.5 - 110, 489 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(382.5 + 245 + 110, 489 - 400 + y);
  ctx.lineTo(327.5 + 245 + 110, 561 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 526 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 461 - 400 + y);
  ctx.lineTo(382.5 + 245 + 110, 489 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(226.5 + 245 + 110, 314 - 400 + y);
  ctx.lineTo(327.5 + 245 + 110, 287 - 400 + y);
  ctx.lineTo(380.5 + 245 + 110, 370 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 390 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 314 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(195.5, 68 + y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "hotpink";
  ctx.beginPath();
  ctx.moveTo(70 - 110, 380 - 400 + y);
  ctx.lineTo(70 - 110, 479 - 400 + y);
  ctx.lineTo(226.5 - 110, 451 - 400 + y);
  ctx.lineTo(226.5 - 110, 400 - 400 + y);
  ctx.lineTo(70 - 110, 382 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(383 + 245 + 110, 380 - 400 + y);
  ctx.lineTo(383 + 245 + 110, 479 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 451 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 400 - 400 + y);
  ctx.lineTo(383 + 245 + 110, 382 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(86.5 + 20, 11 + 10 + y);
  ctx.lineTo(190.5 + 20, 11 + 10 + y);
  ctx.lineTo(224.5 + 20, 40 + 10 + y);
  ctx.lineTo(237.5 + 20, 129 + 10 + y);
  ctx.lineTo(136.5 + 20, 79 + 10 + y);
  ctx.lineTo(86.5 + 20, 11 + 10 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(594.5, 11 + 10 + y);
  ctx.lineTo(490.5, 11 + 10 + y);
  ctx.lineTo(456.5, 40 + 10 + y);
  ctx.lineTo(443.5, 129 + 10 + y);
  ctx.lineTo(544.5, 79 + 10 + y);
  ctx.lineTo(594.5, 11 + 10 + y);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.arc(350, 123 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(330, 33 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(370, 33 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(315.5, 235 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(384.5, 235 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(350, 0 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "hotpink";
  ctx.beginPath();
  ctx.arc(350, 20 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(350, 45 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(325, 10 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(375, 10 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(350, 80 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(320, 80 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(320, -60 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(380, -60 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(180, -65 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(200, -68 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(220, -60 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(240, -63 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(260, -53 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(180 + 340, -65 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(200 + 300, -68 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(220 + 260, -60 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(240 + 220, -63 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(260 + 180, -53 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(380, -60 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(330, -80 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(370, -80 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(290, 60 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(380, 80 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(410, 60 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(122.5, 13 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150.5, 7 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(178.5, 6.5 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(206.5, 7 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(230.5, 19 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(247.5, 34 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(577.5, 13 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(549.5, 7 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(521.5, 6.5 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(493.5, 7 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(469.5, 19 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(452.5, 34 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "teal";
  ctx.beginPath();
  ctx.moveTo(289.5, 189 + y);
  ctx.lineTo(350, 169 + y);
  ctx.lineTo(411.5, 189 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, 174 + y);
  ctx.lineTo(350, 250 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(101.5, 23 + y);
  ctx.lineTo(153.5, 94 + y);
  ctx.lineTo(256.5, 142 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(598.5, 23 + y);
  ctx.lineTo(547.5, 94 + y);
  ctx.lineTo(443.5, 142 + y);
  ctx.stroke();
  ctx.strokeStyle = "hotpink";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(405, -93 + y);
  ctx.lineTo(405, -28 + y);
  ctx.lineTo(350, -43 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(295, -93 + y);
  ctx.lineTo(295, -28 + y);
  ctx.lineTo(350, -43 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "teal";
  ctx.moveTo(535, -83 + y);
  ctx.lineTo(535, -48 + y);
  ctx.lineTo(430, -33 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "hotpink";
  ctx.moveTo(295, 13 + y);
  ctx.lineTo(295, 28 + y);
  ctx.lineTo(350, 63 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "teal";
  ctx.moveTo(165, -83 + y);
  ctx.lineTo(165, -48 + y);
  ctx.lineTo(270, -33 + y);
  ctx.stroke();
  ctx.beginPath();

  ctx.moveTo(300, 119 + y);
  ctx.lineTo(300, 141 + y);
  ctx.lineTo(325, 160 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(400, 119 + y);
  ctx.lineTo(400, 141 + y);
  ctx.lineTo(375, 160 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "teal";
  ctx.moveTo(350, -97 + y);
  ctx.lineTo(350, -7 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "hotpink";
  ctx.moveTo(405, 13 + y);
  ctx.lineTo(405, 28 + y);
  ctx.lineTo(350, 63 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(295, 13 + y);
  ctx.lineTo(295, 28 + y);
  ctx.lineTo(350, 63 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, 93 + y);
  ctx.lineTo(325, 123 + y);
  ctx.lineTo(352, 153 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, 93 + y);
  ctx.lineTo(375, 123 + y);
  ctx.lineTo(347, 153 + y);
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(190.5 + 20, 11 + 10 + y);
  ctx.lineTo(200.5 + 20, 20 + 10 + y);
  ctx.lineTo(182.5 + 20, 102 + 10 + y);
  ctx.lineTo(136.5 + 20, 79 + 10 + y);
  ctx.lineTo(190.5 + 20, 11 + 10 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(510.5 - 20, 11 + 10 + y);
  ctx.lineTo(500.5 - 20, 20 + 10 + y);
  ctx.lineTo(518.5 - 20, 102 + 10 + y);
  ctx.lineTo(564.5 - 20, 79 + 10 + y);
  ctx.lineTo(510.5 - 20, 11 + 10 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(273, 191 + y);
  ctx.lineTo(259, 212 + y);
  ctx.lineTo(276, 246 + y);
  ctx.lineTo(273, 191 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(427, 191 + y);
  ctx.lineTo(441, 212 + y);
  ctx.lineTo(424, 246 + y);
  ctx.lineTo(427, 191 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(294.5, 264 + y);
  ctx.lineTo(291.5, 279 + y);
  ctx.lineTo(323.5, 312 + y);
  ctx.lineTo(313.5, 288 + y);
  ctx.lineTo(316.5, 278 + y);
  ctx.moveTo(294.5, 264 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(405.5, 264 + y);
  ctx.lineTo(408.5, 279 + y);
  ctx.lineTo(376.5, 312 + y);
  ctx.lineTo(386.5, 288 + y);
  ctx.lineTo(383.5, 278 + y);
  ctx.moveTo(405.5, 264 + y);
  ctx.fill();
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.arc(195.5, 68 + y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.arc(504.5, 68 + y, 10, 0, 2 * Math.PI);
  ctx.fill();
}

function gameOver() {
  drawGameOver();
}

// Draw Game Over Screen
function drawGameOver() {
  // Background
  drawMainComponents();

  // Game Over Text
  ctx.font = "40px Consolas";
  ctx.fillStyle = "white";
  ctx.fillText("GAME OVER", 250, 285);

  ctx.font = "20px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 290, 350);
  ctx.fillText("Enemies Killed: " + enemyKilled, 270, 400);
  ctx.fillText("Time Lived: " + timeLived + " sec", 260, 450);
}

function reset() {
  gameIsOver = false;
  location.reload();
}

function drawMainComponents() {
  // Background
  ctx.fillStyle = "darkred";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // Orange Bars
  ctx.fillStyle = "orange";
  ctx.fillRect(0, 0, cnv.width, 50);
  ctx.fillRect(0, cnv.height - 50, cnv.width, 50);
}

function increaseScore(points) {
  score += points;
}

function getObject() {
  let object = {
    x: Math.random(),
    y: Math.random(),
    radius: Math.random() * 20 + 10,
    dy: Math.random() * 1.5 + 0.5,
    dx: Math.random() * 1.5 + 0.5,
    r: Math.random() * 155 + 100,
    g: 255,
    b: Math.random() * 255,
  };

  object.xHome = object.x;

  return object;
}

function getLaser(sprite) {
  let aLaser = {
    x1: sprite.x + 5,
    y1: sprite.y + 5,
    x2: mouseX,
    y2: mouseY,
  };

  return aLaser;
}

function shootLaser(sprite) {
  allLaser.push(getLaser(sprite));
  for (let i = 0; i < allLaser.length; i++) {
    ctx.beginPath();
    ctx.moveTo(sprite.x + 5, sprite.y + 5);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function getRocketLaser(rocketHitBox) {
  let aRocketLaser = {
    x1: rocketHitBox.x + 295, // 55
    y1: rocketHitBox.y + 475, // 65
    x2: mouseX,
    y2: mouseY,
  };

  return aRocketLaser;
}

function shootRocketLaser(rocketHitBox) {
  allRocketLaser.push(getRocketLaser(rocketHitBox));
  for (let i = 0; i < allRocketLaser.length; i++) {
    ctx.beginPath();
    ctx.moveTo(rocketHitBox.x + 55 + 295, rocketHitBox.y + 65 + 475);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 10;
    ctx.stroke();
  }
}

function movement() {
  if (dDown) {
    sprite.x += 2;
    if (sprite.x + sprite.width > cnv.width) {
      sprite.x = 700 - sprite.width;
    }
  }

  if (aDown) {
    sprite.x -= 2;
    if (sprite.x < 0) {
      sprite.x += 2;
    }
  }

  if (wDown) {
    sprite.y -= 2;

    if (sprite.y < 0) {
      sprite.y += 2;
    }
  }

  if (sDown) {
    sprite.y += 2;

    if (sprite.y + sprite.height > cnv.height) {
      sprite.y = 700 - sprite.height;
    }
  }
}

function enemyObjects() {
  for (let i = 0; i < allObjects.length; i++) {
    if (collision(allObjects[i]) == true && mouseDown == true) {
      if (quadrants() == "1") {
        allObjects[i].x = -100;
        console.log("1");
        allObjects[i].y = Math.random() * cnv.height;
      } else if (quadrants() == "2") {
        allObjects[i].x = 700;
        console.log("2");
        allObjects[i].y = Math.random() * cnv.height;
      } else if (quadrants() == "3") {
        allObjects[i].x = Math.random() * cnv.width;
        allObjects[i].y = -100;
        console.log("3");
      } else if (quadrants() == "4") {
        allObjects[i].x = Math.random() * cnv.width;
        allObjects[i].y = 700;
      }
    }
  }

  for (let i = 0; i < allObjects.length; i++) {
    ctx.fillStyle = `rgb(${allObjects[i].r}, ${allObjects[i].g}, ${allObjects[i].b})`;
    ctx.beginPath();
    ctx.arc(
      allObjects[i].x,
      allObjects[i].y,
      allObjects[i].radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }

  // Objects
  for (let i = 0; i < allObjects.length; i++) {
    if (sprite.x - allObjects[i].x < 0) {
      allObjects[i].x -= allObjects[i].dx;
    } else if (sprite.x - allObjects[i].x > 0) {
      allObjects[i].x += allObjects[i].dx;
    }

    if (sprite.y - allObjects[i].y < 0) {
      allObjects[i].y -= allObjects[i].dy;
    } else if (sprite.y - allObjects[i].y > 0) {
      allObjects[i].y += allObjects[i].dy;
    }
  }
}

function drawFireBall() {
  ctx.lineWidth = 100;
  ctx.fillStyle = `rgba(255, 153, 0, ${opacity})`;
  ctx.fillRect(rand, aFireBall.y, aFireBall.width, aFireBall.height);
}

function drawDragonFireBall() {
  ctx.fillStyle = `rgba(162, 0, 255, ${opacity})`;
  ctx.fillRect(
    aDragonFireBall.x,
    aDragonFireBall.y,
    aDragonFireBall.width,
    aDragonFireBall.height
  );
}

// Yuvraj

// Const

const grad2 = ctx.createLinearGradient(0, 0, 550, 0);
grad2.addColorStop(0, "pink");
grad2.addColorStop(0.5, "lightgreen");
grad2.addColorStop(1, "pink");
const grad10 = ctx.createLinearGradient(0, 0, 550, 0);
grad10.addColorStop(0, "lightgreen");
grad10.addColorStop(1, "pink");
const grad11 = ctx.createLinearGradient(0, 0, 600, 0);
grad11.addColorStop(0, "lightgreen");
grad11.addColorStop(1, "pink");
const grad12 = ctx.createLinearGradient(0, 0, 880, 0);
grad12.addColorStop(0, "lightgreen");
grad12.addColorStop(1, "pink");
const grad3 = ctx.createLinearGradient(0, 0, 550, 0);
grad3.addColorStop(0, "skyblue");
grad3.addColorStop(1, "purple");
const grad4 = ctx.createLinearGradient(0, 0, 600, 0);
grad4.addColorStop(0, "skyblue");
grad4.addColorStop(1, "purple");
const grad5 = ctx.createLinearGradient(0, 0, 880, 0);
grad5.addColorStop(0, "skyblue");
grad5.addColorStop(1, "purple");
const grad = ctx.createLinearGradient(0, 0, 500, 0);
grad.addColorStop(0, "purple");
grad.addColorStop(0.5, "skyblue");
grad.addColorStop(1, "purple");
ctx.fillStyle = grad;

// Vars
let obstacle;
let orbitY = 0;
let asteroidX = 0;
let allStars = [];
randNum = Math.floor(Math.random() * 5 + 1);

// Functions

// good speeds: 10+,

function drawStar() {
  let aStar = {
    x: Math.random() * cnv.width,
    y: Math.random() * cnv.height,
    r: Math.random() * 10,
    dy: Math.random() * 20 + 10,
    o: Math.random() * 1,
  };
  return aStar;
}

for (i = 0; i < 100; i++) {
  allStars.push(drawStar());
}

function rocketHitBoxLaser(x, y) {
  rocketHitBox.x = x;
  rocketHitBox.y = y;
  ctx.fillStyle = "rgba(255, 0, 0, 0)";
  ctx.fillRect(
    rocketHitBox.x + 295,
    rocketHitBox.y + 475,
    rocketHitBox.width,
    rocketHitBox.height
  );
}

function drawRocket(x, y) {
  // Hitbox
  rocketHitBoxLaser(x, y);
  ctx.fillStyle = "maroon";
  ctx.beginPath();
  ctx.moveTo(350 + x, 475 + y);
  ctx.lineTo(300 + x, 575 + y);
  ctx.lineTo(400 + x, 575 + y);
  ctx.lineTo(350 + x, 475 + y);
  ctx.fill();
  ctx.fillStyle = "maroon";
  ctx.beginPath();
  ctx.moveTo(350 + x, 605 + y);
  ctx.lineTo(300 + x, 505 + y);
  ctx.lineTo(400 + x, 505 + y);
  ctx.lineTo(350 + x, 605 + y);
  ctx.fill();
  ctx.fillStyle = "lightblue";
  ctx.beginPath();
  ctx.arc(350 + x, 540 + y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "plum";
  ctx.beginPath();
  ctx.arc(350 + x, 540 + y, 15, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "lightgreen";
  ctx.beginPath();
  ctx.arc(350 + x, 540 + y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "plum";
  ctx.beginPath();
  ctx.arc(350 + x, 500 + y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(350 + x, 500 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "plum";
  ctx.beginPath();
  ctx.arc(320 + x, 562 + y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(320 + x, 562 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "plum";
  ctx.beginPath();
  ctx.arc(380 + x, 562 + y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(380 + x, 562 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.arc(318 + x, 517 + y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(318 + x, 517 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.arc(381 + x, 517 + y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(381 + x, 517 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.arc(350 + x, 582 + y, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(350 + x, 582 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawOrbitL(x, y) {
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(0.5 + x, -357 + y, 100, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.arc(0 + x, -357 + y, 350, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0 + x, -357 + y, 300, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0 + x, -357 + y, 255, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0.5 + x, -357 + y, 200, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "lightgreen";
  ctx.beginPath();
  ctx.arc(160.5 + x, -557 + y, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "violet";
  ctx.beginPath();
  ctx.arc(170.5 + x, -250 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(100.5 + x, -77 + y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "lightblue";
  ctx.beginPath();
  ctx.arc(339.5 + x, -427 + y, 60, 0, 2 * Math.PI);
  ctx.fill();
}
function drawOrbitR(x, y) {
  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(0.5 + 700 + x, -357 + y, 100, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.arc(0 + 700 + x, -357 + y, 350, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0 + 700 + x, -357 + y, 300, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0 + 700 + x, -357 + y, 255, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0.5 + 700 + x, -357 + y, 200, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "purple";
  ctx.beginPath();
  ctx.arc(160.5 + 380 + x, -557 + y, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(170.5 + 370 + x, -250 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "brown";
  ctx.beginPath();
  ctx.arc(100.5 + 500 + x, -77 + y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "salmon";
  ctx.beginPath();
  ctx.arc(339.5 + 20.5 + x, -427 + y, 60, 0, 2 * Math.PI);
  ctx.fill();
}

function drawAsteroids(dx) {
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(-770 + dx, 413 + 200, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 433 + 200, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 423 + 200, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 443 + 200, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-770 + dx, 407 + 200, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 444 + 200, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 420 + 200, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 447 + 200, 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(-770 + dx, 413 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 433 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 423 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 443 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-770 + dx, 407 + 100, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 444 + 100, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 420 + 100, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + dx, 447 + 100, 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 413, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 433, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 423, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 443, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 407, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 444, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 420, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 300 + dx, 447, 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 413 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 433 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 423 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 443 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 407 + 100, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 444 + 100, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 420 + 100, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 450 + dx, 447 + 100, 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 413, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 433, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 423, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 443, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 407, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 444, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 420, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 600 + dx, 447, 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 413 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 433 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 423 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 443 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 407 + 100, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 444 + 100, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 420 + 100, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 - 150 + dx, 447 + 100, 7, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 413 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 433 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 423 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 443 + 100, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 407 + 100, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 444 + 100, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 420 + 100, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-770 + 750 + dx, 447 + 100, 7, 0, 2 * Math.PI);
  ctx.fill();
}

function obstacleGenerator(rand) {
  if (rand == 1) {
    obstacle = drawOrbitL(-20, orbitY);
    orbitY += 15;
    if (orbitY > cnv.height + 1000) {
      asteroidX = 0;
      orbitY = 0;
      randNum = Math.floor(Math.random() * 5 + 1);
    }
  }
  if (rand == 2) {
    obstacle = drawOrbitR(-20, orbitY);
    orbitY += 15;
    if (orbitY > cnv.height + 1000) {
      asteroidX = 0;
      orbitY = 0;
      randNum = Math.floor(Math.random() * 5 + 1);
    }
  }
  if (rand == 3) {
    obstacle = drawAsteroids(asteroidX);
    asteroidX += 15;
    if (asteroidX > cnv.width + 1000) {
      asteroidX = 0;
      orbitY = 0;
      randNum = Math.floor(Math.random() * 5 + 1);
    }
  }
  if (rand == 4) {
    obstacle = drawPlanet(asteroidX, orbitY);
    orbitY += 15;
    asteroidX += 15;
    if (asteroidX > cnv.width + 1000 && orbitY > cnv.height + 1000) {
      asteroidX = 0;
      orbitY = 0;
      randNum = Math.floor(Math.random() * 5 + 1);
    }
  }
  if (rand == 5) {
    obstacle = drawPlanet2(asteroidX, orbitY);
    orbitY += 15;
    asteroidX -= 15;
    if (asteroidX < -1000 && orbitY > cnv.height + 1000) {
      asteroidX = 0;
      orbitY = 0;
      randNum = Math.floor(Math.random() * 5 + 1);
    }
  }

  return obstacle;
}

function drawPlanet(x, y) {
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(350 - 700 + x, 350 - 700 + y, 225, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad3;
  ctx.beginPath();
  ctx.arc(270 - 700 + x, 280 - 700 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad4;
  ctx.beginPath();
  ctx.arc(370 - 700 + x, 470 - 700 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad5;
  ctx.beginPath();
  ctx.arc(500 - 700 + x, 340 - 700 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad5;
  ctx.beginPath();
  ctx.arc(420 - 700 + x, 230 - 700 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad3;
  ctx.beginPath();
  ctx.arc(230 - 700 + x, 430 - 700 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
}
function drawPlanet2(x, y) {
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.arc(350 + 700 + x, 350 - 700 + y, 225, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad10;
  ctx.beginPath();
  ctx.arc(270 + 700 + x, 280 - 700 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad11;
  ctx.beginPath();
  ctx.arc(370 + 700 + x, 470 - 700 + y, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad12;
  ctx.beginPath();
  ctx.arc(500 + 700 + x, 340 - 700 + y, 20, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad12;
  ctx.beginPath();
  ctx.arc(420 + 700 + x, 230 - 700 + y, 35, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = grad10;
  ctx.beginPath();
  ctx.arc(230 + 700 + x, 430 - 700 + y, 40, 0, 2 * Math.PI);
  ctx.fill();
}
function drawDragoon(y) {
  ctx.fillStyle = "#4e4e94";
  ctx.beginPath();
  ctx.moveTo(264.5, 177 + y);
  ctx.lineTo(264.5, 253 + y);
  ctx.lineTo(350, 310 + y);
  ctx.lineTo(435.5, 253 + y);
  ctx.lineTo(435.5, 177 + y);
  ctx.lineTo(264.5, 177 + y);
  ctx.fill();
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.moveTo(50, 0 + y);
  ctx.lineTo(102, 92 + y);
  ctx.lineTo(155.5, 152 + y);
  ctx.lineTo(272.5, 181 + y);
  ctx.lineTo(275.5, 253 + y);
  ctx.lineTo(350, 300 + y);
  ctx.lineTo(424.5, 253 + y);
  ctx.lineTo(427.5, 181 + y);
  ctx.lineTo(554.5, 142 + y);
  ctx.lineTo(598, 92 + y);
  ctx.lineTo(650, 0 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(141.5, 132 + y);
  ctx.lineTo(18.5, 176 + y);
  ctx.lineTo(-50, 88 + y);
  ctx.lineTo(-50, -20 + y);
  ctx.lineTo(18.5, -128 + y);
  ctx.lineTo(141.5, -96 + y);
  ctx.lineTo(141.5, 132 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(558.5, 132 + y);
  ctx.lineTo(681.5, 176 + y);
  ctx.lineTo(750, 88 + y);
  ctx.lineTo(750, -20 + y);
  ctx.lineTo(681.5, -128 + y);
  ctx.lineTo(558.5, -96 + y);
  ctx.lineTo(558.5, 132 + y);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.moveTo(226.5 - 110, 314 - 400 + y);
  ctx.lineTo(125.5 - 110, 287 - 400 + y);
  ctx.lineTo(72.5 - 110, 370 - 400 + y);
  ctx.lineTo(226.5 - 110, 390 - 400 + y);
  ctx.lineTo(226.5 - 110, 314 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(70.5 - 110, 489 - 400 + y);
  ctx.lineTo(125.5 - 110, 561 - 400 + y);
  ctx.lineTo(226.5 - 110, 526 - 400 + y);
  ctx.lineTo(226.5 - 110, 461 - 400 + y);
  ctx.lineTo(70.5 - 110, 489 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(382.5 + 245 + 110, 489 - 400 + y);
  ctx.lineTo(327.5 + 245 + 110, 561 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 526 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 461 - 400 + y);
  ctx.lineTo(382.5 + 245 + 110, 489 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(226.5 + 245 + 110, 314 - 400 + y);
  ctx.lineTo(327.5 + 245 + 110, 287 - 400 + y);
  ctx.lineTo(380.5 + 245 + 110, 370 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 390 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 314 - 400 + y);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(50, 0 + y);
  ctx.lineTo(105.5, -70 + y);
  ctx.lineTo(350, -105 + y);
  ctx.lineTo(594.5, -70 + y);
  ctx.lineTo(650, 0 + y);
  ctx.lineTo(50, 0 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(195.5, 68 + y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "hotpink";
  ctx.beginPath();
  ctx.moveTo(70 - 110, 380 - 400 + y);
  ctx.lineTo(70 - 110, 479 - 400 + y);
  ctx.lineTo(226.5 - 110, 451 - 400 + y);
  ctx.lineTo(226.5 - 110, 400 - 400 + y);
  ctx.lineTo(70 - 110, 382 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(383 + 245 + 110, 380 - 400 + y);
  ctx.lineTo(383 + 245 + 110, 479 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 451 - 400 + y);
  ctx.lineTo(226.5 + 245 + 110, 400 - 400 + y);
  ctx.lineTo(383 + 245 + 110, 382 - 400 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(86.5 + 20, 11 + 10 + y);
  ctx.lineTo(190.5 + 20, 11 + 10 + y);
  ctx.lineTo(224.5 + 20, 40 + 10 + y);
  ctx.lineTo(237.5 + 20, 129 + 10 + y);
  ctx.lineTo(136.5 + 20, 79 + 10 + y);
  ctx.lineTo(86.5 + 20, 11 + 10 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(594.5, 11 + 10 + y);
  ctx.lineTo(490.5, 11 + 10 + y);
  ctx.lineTo(456.5, 40 + 10 + y);
  ctx.lineTo(443.5, 129 + 10 + y);
  ctx.lineTo(544.5, 79 + 10 + y);
  ctx.lineTo(594.5, 11 + 10 + y);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.arc(350, 123 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(330, 33 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(370, 33 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(315.5, 235 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(384.5, 235 + y, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = "teal";
  ctx.beginPath();
  ctx.moveTo(289.5, 189 + y);
  ctx.lineTo(350, 169 + y);
  ctx.lineTo(411.5, 189 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, 174 + y);
  ctx.lineTo(350, 250 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(101.5, 23 + y);
  ctx.lineTo(153.5, 94 + y);
  ctx.lineTo(256.5, 142 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(598.5, 23 + y);
  ctx.lineTo(547.5, 94 + y);
  ctx.lineTo(443.5, 142 + y);
  ctx.stroke();
  ctx.strokeStyle = "hotpink";
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(300, 219 + y);
  ctx.lineTo(300, 241 + y);
  ctx.lineTo(325, 260 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(400, 219 + y);
  ctx.lineTo(400, 241 + y);
  ctx.lineTo(375, 260 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, 13 + y);
  ctx.lineTo(350, 93 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(405, 13 + y);
  ctx.lineTo(405, 28 + y);
  ctx.lineTo(350, 63 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(295, 13 + y);
  ctx.lineTo(295, 28 + y);
  ctx.lineTo(350, 63 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, 93 + y);
  ctx.lineTo(325, 123 + y);
  ctx.lineTo(352, 153 + y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(350, 93 + y);
  ctx.lineTo(375, 123 + y);
  ctx.lineTo(347, 153 + y);
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(190.5 + 20, 11 + 10 + y);
  ctx.lineTo(200.5 + 20, 20 + 10 + y);
  ctx.lineTo(182.5 + 20, 102 + 10 + y);
  ctx.lineTo(136.5 + 20, 79 + 10 + y);
  ctx.lineTo(190.5 + 20, 11 + 10 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(510.5 - 20, 11 + 10 + y);
  ctx.lineTo(500.5 - 20, 20 + 10 + y);
  ctx.lineTo(518.5 - 20, 102 + 10 + y);
  ctx.lineTo(564.5 - 20, 79 + 10 + y);
  ctx.lineTo(510.5 - 20, 11 + 10 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(273, 191 + y);
  ctx.lineTo(259, 212 + y);
  ctx.lineTo(276, 246 + y);
  ctx.lineTo(273, 191 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(427, 191 + y);
  ctx.lineTo(441, 212 + y);
  ctx.lineTo(424, 246 + y);
  ctx.lineTo(427, 191 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(294.5, 264 + y);
  ctx.lineTo(291.5, 279 + y);
  ctx.lineTo(323.5, 312 + y);
  ctx.lineTo(313.5, 288 + y);
  ctx.lineTo(316.5, 278 + y);
  ctx.moveTo(294.5, 264 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(405.5, 264 + y);
  ctx.lineTo(408.5, 279 + y);
  ctx.lineTo(376.5, 312 + y);
  ctx.lineTo(386.5, 288 + y);
  ctx.lineTo(383.5, 278 + y);
  ctx.moveTo(405.5, 264 + y);
  ctx.fill();
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.arc(195.5, 68 + y, 10, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.arc(504.5, 68 + y, 10, 0, 2 * Math.PI);
  ctx.fill();
}
function drawHandLeft(y) {
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.moveTo(458.5 - 550, 132 + 500 + y);
  ctx.lineTo(581.5 - 550, 176 + 500 + y);
  ctx.lineTo(650 - 550, 88 + 500 + y);
  ctx.lineTo(650 - 550, -20 + 500 + y);
  ctx.lineTo(581.5 - 550, -128 + 500 + y);
  ctx.lineTo(458.5 - 550, -96 + 500 + y);
  ctx.lineTo(458.5 - 550, 132 + 500 + y);
  ctx.fill();
  ctx.fillStyle = "hotpink";
  ctx.beginPath();
  ctx.arc(30.5, 527 + y, 60, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(35, 526, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.moveTo(206.5, 314 + 100 + y);
  ctx.lineTo(105.5, 287 + 100 + y);
  ctx.lineTo(52.5, 370 + 100 + y);
  ctx.lineTo(206.5, 390 + 100 + y);
  ctx.lineTo(206.5, 314 + 100 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(50.5, 489 + 100 + y);
  ctx.lineTo(105.5, 561 + 100 + y);
  ctx.lineTo(206.5, 526 + 100 + y);
  ctx.lineTo(206.5, 461 + 100 + y);
  ctx.lineTo(50.5, 489 + 100 + y);
  ctx.fill();
}
function drawHandRight(y) {
  ctx.fillStyle = "#00072D";
  ctx.beginPath();
  ctx.moveTo(241.5 + 550, 132 + 500 + y);
  ctx.lineTo(118.5 + 550, 176 + 500 + y);
  ctx.lineTo(50 + 550, 88 + 500 + y);
  ctx.lineTo(50 + 550, -20 + 500 + y);
  ctx.lineTo(118.5 + 550, -128 + 500 + y);
  ctx.lineTo(241.5 + 550, -96 + 500 + y);
  ctx.lineTo(241.5 + 550, 132 + 500 + y);
  ctx.fill();
  ctx.fillStyle = "hotpink";
  ctx.beginPath();
  ctx.arc(669.5, 527 + y, 60, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(665, 526, 30, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "turquoise";
  ctx.beginPath();
  ctx.moveTo(382.5 + 265, 489 + 100 + y);
  ctx.lineTo(327.5 + 265, 561 + 100 + y);
  ctx.lineTo(226.5 + 265, 526 + 100 + y);
  ctx.lineTo(226.5 + 265, 461 + 100 + y);
  ctx.lineTo(382.5 + 265, 489 + 100 + y);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(226.5 + 265, 314 + 100 + y);
  ctx.lineTo(327.5 + 265, 287 + 100 + y);
  ctx.lineTo(380.5 + 265, 370 + 100 + y);
  ctx.lineTo(226.5 + 265, 390 + 100 + y);
  ctx.lineTo(226.5 + 265, 214 + 100 + y);
  ctx.fill();
}
