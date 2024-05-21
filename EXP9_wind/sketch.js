// Coding Train / Daniel Shiffman
// adapted w/ml5 poseNET example to interactive text representation

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

let mensagem = "Acrobacia!";
let font;

let vw;
let vh;

// speech recognition features

let speechRecognition;
let isListening = false;
let textToShow = "";

function preload() {
  font = loadFont("Acumin-BdPro.otf");
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
  console.log(mensagem.length);
  //pointsType.push(new Particle(1000, 400));

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (i !== j) {
        let a = particles[i];
        let b = particles[j];
        // let b = particles[(i + 1) % particles.length];
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
  poseNet = ml5.poseNet(video, { flipHorizontal: true }, modelLoaded);
  poseNet.on("pose", gotPoses);

  textFont(font);
  textAlign(CENTER);

  // Initialize speech recognition
  speechRecognition = new webkitSpeechRecognition() || new SpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  speechRecognition.lang = "pt-PT";

  // Handle the result event
  speechRecognition.onresult = function (event) {
    if (event.results.length > 0) {
      textToShow = event.results[0][0].transcript;
    }
  };
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  mensagem = textToShow;
  background(255);
  push();
  translate(vw, 0);
  scale(-1, 1);
  //image(video, 0, 0, vw, vh);
  pop();
  //translate(-vw, 0);

  //fill(255);
  //rect(0, 0, vw, vh);

  //image(video, 0, 0, width, (1080*width)/1920);
  if (pose) {
    // We can call both functions to draw all keypoints and the skeletons

    physics.update();

    noStroke();
    if (showSprings) stroke(250, 50, 126);

    noFill();
    if (showSprings) noFill();
    //fill(45, 197, 244, 100);
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
    //x5 = pointsType[4].x;
    let y1 = pointsType[0].y,
      y2 = pointsType[1].y,
      y3 = pointsType[2].y,
      y4 = pointsType[3].y;
    //y5 = pointsType[4].y;
    //bezier(x1, y1, x2, y2, x3, y3, x4, y4);
    textSize(100);
    for (let i = 0; i <= mensagem.length; i++) {
      let steps = i / mensagem.length;
      let pointX = bezierPoint(x1, x2, x3, x4, steps);
      let pointY = bezierPoint(y1, y2, y3, y4, steps);
      if (steps > 0) {
        let currentChar = mensagem.charAt(i - 1);
        noStroke();
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
      prevPointX = pointX;
      prevPointY = pointY;

      // pop();
      //circle(pointX, pointY, 20);
    }

    endShape();

    if (showSprings) {
      for (let spring of springs) {
        spring.show();
      }
    }

    pointsType[0].lock();
    pointsType[0].x = pose.leftWrist.x;
    pointsType[0].y = pose.leftWrist.y;
    pointsType[0].unlock();
    pointsType[3].lock();
    pointsType[3].x = pose.rightWrist.x;
    pointsType[3].y = pose.rightWrist.y;
    pointsType[3].unlock();
  }
}

function keyPressed() {
  if (keyCode === 32) {
    // Spacebar
    if (!isListening) {
      speechRecognition.start();
      isListening = true;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    // Spacebar
    if (isListening) {
      speechRecognition.stop();
      isListening = false;
    }
  }
}

/* function keyPressed() {
  if (key == " ") {
    showSprings = !showSprings;
  }
} */

function dot2(v, w) {
  let dot = v.x * w.x + v.y * w.y;
  return dot;
}

function angleBetween(v, w) {
  let dot = dot2(v, w);
  theta = acos(dot / (v.mag() * w.mag()));
  return theta;
}
