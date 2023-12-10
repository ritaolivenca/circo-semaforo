const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

let physics;

let particles = [];
let pointsType = [];

let springs = [];
let showSprings = false;

let video;
let poseNet;
let pose;
let skeleton;

let mensagem = " ANDRÉ";
let font;

let vw;
let vh;

function preload() {
  font = loadFont("GoshaSans-Bold.otf");
}

function keyPressed() {
  if (key == " ") {
    showSprings = !showSprings;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);

  particles.push(new Particle(width / 6, height / 4));
  particles.push(new Particle((5 * width) / 6, height / 4));
  particles.push(new Particle(width / 6, (3 * height) / 4));
  particles.push(new Particle((5 * width) / 6, (3 * height) / 4));

  for (let j = 0; j < 4; j++) {
    pointsType.push(new Particle((j * width) / 4, height / 2));
  }

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (i !== j) {
        let a = particles[i];
        let b = particles[j];
        springs.push(new Spring(a, b, 0.001));
      }
    }
  }

  for (let particle of particles) {
    springs.push(new Spring(particle, pointsType[0], 0.01));
    springs.push(new Spring(particle, pointsType[1], 0.01));
    springs.push(new Spring(particle, pointsType[2], 0.01));
    springs.push(new Spring(particle, pointsType[3], 0.01));
  }

  springs.push(new Spring(particles[0], particles[2], 0.01));
  springs.push(new Spring(particles[1], particles[3], 0.01));

  video = createCapture(VIDEO);
  vw = width;
  vh = width * (1080 / 1920);
  video.size(vw, vh);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  textFont(font);
  textAlign(CENTER);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  background(255);
  image(video, 0, 0, vw, vh);

  if (pose) {
    physics.update();

    noStroke();
    if (showSprings) stroke(250, 50, 126);

    noFill();
    if (showSprings) noFill();
    strokeWeight(3);
    beginShape();
    for (let particle of particles) {
      vertex(particle.x, particle.y);
    }
    endShape(CLOSE);

    beginShape();
    stroke(250, random(100, 200), 0);
    strokeWeight(1);

    let x1 = pointsType[0].x,
      x2 = pointsType[1].x,
      x3 = pointsType[2].x,
      x4 = pointsType[3].x;

    let y1 = pointsType[0].y,
      y2 = pointsType[1].y,
      y3 = pointsType[2].y,
      y4 = pointsType[3].y;

    textSize(100);
    let spacing = 10;
    let totalTextWidth = 0;

    for (let i = 0; i < mensagem.length; i++) {
      let currentChar = mensagem.charAt(i);
      let charWidth = textWidth(currentChar);
      totalTextWidth += charWidth + spacing;
    }

    let startX = (width - totalTextWidth) / 2;

    for (let i = 0; i < mensagem.length; i++) {
      let steps = i / (mensagem.length - 1);
      let pointX = bezierPoint(x1, x2, x3, x4, steps);
      let pointY = bezierPoint(y1, y2, y3, y4, steps);

      if (steps > 0) {
        let prevPointX = bezierPoint(x1, x2, x3, x4, steps - 1);
        let prevPointY = bezierPoint(y1, y2, y3, y4, steps - 1);

        let currentChar = mensagem.charAt(i);
        stroke(0);
        line(pointX, pointY, prevPointX, prevPointY);

        let LE = createVector(pointX, pointY);
        let LR = createVector(prevPointX, prevPointY);
        let normal = createVector(width / 2, 0);

        let dir = LE.sub(LR);
        dir.normalize();
        dir.mult(200);
        let angle = angleBetween(normal, dir);
        fill(0);
        noStroke();

        push();
        translate(pointX, pointY);
        rotate(angle);
        text(currentChar, 0, 0);
        pop();
      }

      fill(250);
      noStroke();

      startX += textWidth(mensagem.charAt(i)) + spacing;
    }

    endShape();

    if (showSprings) {
      for (let spring of springs) {
        spring.show();
      }
    }

    pointsType[0].lock();
    pointsType[0].x = pose.rightWrist.x;
    pointsType[0].y = pose.rightWrist.y;
    pointsType[0].unlock();
    pointsType[3].lock();
    pointsType[3].x = pose.leftWrist.x;
    pointsType[3].y = pose.leftWrist.y;
    pointsType[3].unlock();
  }
}

function dot2(v, w) {
  let dot = v.x * w.x + v.y * w.y;
  return dot;
}

function angleBetween(v, w) {
  let dot = dot2(v, w);
  theta = acos(dot / (v.mag() * w.mag()));
  return theta;
}
