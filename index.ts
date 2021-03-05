import "./style.css";
import p5 from "p5";
import { Asteroid } from "./asteroid";
import { Laser, ShotType } from "./laser";
import { Explosion } from "./explosion";
import { Spaceship } from "./spaceship";
import { Stars } from "./stars";
import { Shots } from "./shots";
import { Sounds } from "./sounds";
import { StartButton } from "./startButton";

let spaceship: Spaceship;
let stars: Stars;
let lasers: Laser[] = [];
const asteroids: Asteroid[] = [];
let explosions: Explosion[] = [];
let gameOver = false;
let shots: Shots;
let lastShot = 0;
let speed = 120;
const startHits = 0;
let hits = startHits; // Hier zählen wir die Punkte
let startButton: StartButton;

function preload(p: p5) {
  Spaceship.preload(p);
  Laser.preload(p);
  Asteroid.preload(p);
  Explosion.preload(p);
  Shots.preload(p);
  StartButton.preload(p);
  spaceship = new Spaceship(p, 250, 360);
  stars = new Stars(p);
  shots = new Shots(p, 10, 470);
  startButton = new StartButton(p, 250, 320);

  Sounds.preload();
}

function setup(p: p5) {
  p.createCanvas(500, 500);

  setInterval(() => {
    shots.availableShots++;
  }, 1000);

  setInterval(() => {
    if (speed > 20) speed -= 10;
  }, 2000);
}

function draw(p: p5) {
  p.background("black");

  if (gameOver) {
    p.textSize(40);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill("white");
    p.noStroke();
    p.textStyle(p.NORMAL);
    let feedback = "👎";
    if (hits > 10) feedback = "👍";
    p.text("GAME OVER\nScore: " + hits + feedback, p.width / 2, 150);
    startButton.draw();
    return;
  }

  stars.draw();
  drawAsteroids(p);
  drawLasers(p);
  drawSpaceship(p);
  drawExplosions(p);
  detectCollisions(p);
  drawStatusBar(p);

  keyPressed(p);
}

function drawStatusBar(p: p5) {
  p.fill("lightgray");
  p.rect(0, 460, p.width, 500);
  shots.draw();

  p.textSize(15);
  p.textStyle(p.BOLD);
  p.textAlign(p.RIGHT, p.CENTER);
  p.fill("darkred");
  p.stroke("yellow");
  p.text(hits, 463, 480);
  p.noStroke();
}

function drawExplosions(p: p5) {
  for (const explosion of explosions) {
    explosion.draw();
    explosion.duration++;
  }

  explosions = explosions.filter(e => !e.reachedAnimationEnd);
}

function detectCollisions(p: p5) {
  const asteroidCollisions = Asteroid.getCollidingLasers(lasers, asteroids);
  explosions.push(
    ...asteroidCollisions.map(c => {
      return new Explosion(p, lasers[c.laserIndex].x, lasers[c.laserIndex].y);
    })
  );

  for (let i = 0; i < asteroidCollisions.length; i++) {
    Sounds.explosion.currentTime = 0;
    Sounds.explosion.play();
    hits++;

    asteroids.splice(asteroidCollisions[i].asteroidIndex, 1);
    lasers.splice(asteroidCollisions[i].laserIndex, 1);
  }

  if (spaceship.isCollidingWithAsteroids(p, asteroids)) {
    gameOver = true;
  }
}

function drawSpaceship(p: p5) {
  /*
      Ich möchte mir hier etwas
      längeres aufschreiben das sich
      in einer Zeile nicht ausgeht.
  */

  // https://keycode.info/
  if (p.keyIsDown(p.LEFT_ARROW) && spaceship.x >= 5) spaceship.x -= 5;
  else if (p.keyIsDown(p.RIGHT_ARROW) && spaceship.x <= p.width - 2)
    spaceship.x += 5;

  if (p.keyIsDown(p.UP_ARROW) && spaceship.y >= 5) spaceship.y -= 5;
  else if (p.keyIsDown(p.DOWN_ARROW) && spaceship.y <= p.height - 90)
    spaceship.y += 5;

  spaceship.draw();
}

function keyPressed(p: p5) {
  if (
    shots.availableShots > 0 &&
    p.frameCount > lastShot + 7 &&
    (p.keyIsDown(32) || p.keyIsDown(13))
  ) {
    lastShot = p.frameCount;

    if (p.keyIsDown(32)) {
      shots.availableShots--;
      Sounds.laser.currentTime = 0;
      Sounds.laser.play();
      lasers.push(new Laser(p, spaceship.x, spaceship.y));
    } else if (p.keyIsDown(13) && shots.availableShots >= 2) {
      shots.availableShots -= 2;
      Sounds.powershot.currentTime = 0;
      Sounds.powershot.play();
      lasers.push(new Laser(p, spaceship.x - 5, spaceship.y));
      lasers.push(new Laser(p, spaceship.x + 5, spaceship.y));

      /*
      lasers.push(new Laser(p, spaceship.x + 15, spaceship.y));
      lasers.push(new Laser(p, spaceship.x - 15, spaceship.y));
      *
    }
  }
}

function drawAsteroids(p: p5) {
  if (p.frameCount % speed === 0) {
    asteroids.push(new Asteroid(p, p.random(0, p.width), 0, 10));
  }

  for (const asteroid of asteroids) {
    asteroid.draw();
    asteroid.y++;
    asteroid.size += 0.05;
  }
}

function drawLasers(p: p5) {
  for (const laser of lasers) {
    laser.draw();
    laser.move();
  }
}

function mouseClicked(p: p5) {
  if (
    gameOver &&
    p.mouseX >= startButton.left &&
    p.mouseX <= startButton.right &&
    p.mouseY >= startButton.top &&
    p.mouseY <= startButton.bottom
  ) {
    asteroids.splice(0, asteroids.length);
    lasers.splice(0, lasers.length);
    hits = startHits;
    spaceship.x = 250;
    spaceship.y = 320;
    shots.reset();
    speed = 120;
    gameOver = false;
  }
}

const p = new p5((p: p5) => {
  p.preload = () => preload(p);
  p.setup = () => setup(p);
  p.draw = () => draw(p);
  p.mouseClicked = () => mouseClicked(p);
  // p.keyPressed = () => keyPressed(p);
  return p;
});
