// Coding Train / Daniel Shiffman
// adapted w/ml5 poseNET example to interactive text representation
// by André Rocha and Rita Olivença

const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

let physics;
let particles = [];
let pointsType = []; //1st Line
let pointsType2 = []; //2nd Line
let springs = [];
let showSprings = false;

let video;
let poseNet;
let pose;
let skeleton;

let mensagem = " PEDRO  ";
let mensagem2 = "rossio"; //writeTextone//writeTextone
let font;

let vw;
let vh;

function preload() {
  font = loadFont("Acumin-BdPro.otf");
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
    pointsType.push(new Particle((j * width) / 2, height / 3));
  }
  for (let k = 0; k < 4; k++) {
    pointsType2.push(new Particle((k * width) / 2, (2 * height) / 3));
  }

  //console.log(mensagem.length);
  //pointsType.push(new Particle(1000, 400));

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      if (i !== j) {
        let a = particles[i];
        let b = particles[j];
        // let b = particles[(i + 1) % particles.length];
        springs.push(new Spring(a, b, 0.1));
      }
    }
  }

  for (let particle of particles) {
    springs.push(new Spring(particle, pointsType[0], 0.01));
    springs.push(new Spring(particle, pointsType[1], 0.01));
    springs.push(new Spring(particle, pointsType[2], 0.01));
    springs.push(new Spring(particle, pointsType[3], 0.01));
    springs.push(new Spring(particle, pointsType2[0], 0.01));
    springs.push(new Spring(particle, pointsType2[1], 0.01));
    springs.push(new Spring(particle, pointsType2[2], 0.01));
    springs.push(new Spring(particle, pointsType2[3], 0.01));
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
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log("poseNet ready");
}

function draw() {
  background(255);

  //image(video, 0, 0, vw, vh);
  //blendMode(MULTIPLY);
  //fill(250,0,0);
  //rect(0, 0, width, (1080*width)/1920);
  //blendMode(BLEND);
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
    noStroke();
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

    let x5 = pointsType2[0].x,
      x6 = pointsType2[1].x,
      x7 = pointsType2[2].x,
      x8 = pointsType2[3].x;
    //x5 = pointsType[4].x;
    let y5 = pointsType2[0].y,
      y6 = pointsType2[1].y,
      y7 = pointsType2[2].y,
      y8 = pointsType2[3].y;
    //y5 = pointsType[4].y;
    //bezier(x1,y1,x2,y2,x3,y3,x4,y4,);

    //mensagem 1
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

    //mensagem 2
    textSize(60);
    for (let i = 0; i <= mensagem2.length; i++) {
      let steps = i / mensagem2.length;
      let pointX2 = bezierPoint(x5, x6, x7, x8, steps);
      let pointY2 = bezierPoint(y5, y6, y7, y8, steps);
      if (steps > 0) {
        let currentChar2 = mensagem2.charAt(i - 1);
        noStroke();
        line(pointX2, pointY2, prevPointX2, prevPointY2);
        let LE2 = createVector(pointX2, pointY2);
        let LR2 = createVector(prevPointX2, prevPointY2);
        let normal = createVector(width / 2, 0);

        let dir = LE2.sub(LR2);
        dir.normalize();
        dir.mult(200);
        let angle2 = angleBetween(normal, dir);
        fill(30);
        noStroke();

        push();
        translate(pointX2, pointY2);
        rotate(angle2);
        text(currentChar2, 0, 0);
        pop();
      }

      fill(250);
      noStroke();
      prevPointX2 = pointX2;
      prevPointY2 = pointY2;

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
    pointsType[0].x = pose.rightWrist.x;
    pointsType[0].y = pose.rightWrist.y + height / 16;
    pointsType[0].unlock();
    pointsType[3].lock();
    pointsType[3].x = pose.leftWrist.x;
    pointsType[3].y = pose.leftWrist.y + height / 16;
    pointsType[3].unlock();
    pointsType2[0].lock();
    pointsType2[0].x = pose.rightAnkle.x - width / 3;
    pointsType2[0].y = pose.rightAnkle.y - height / 6;
    pointsType2[0].unlock();
    pointsType2[3].lock();
    pointsType2[3].x = pose.leftAnkle.x + width / 3;
    pointsType2[3].y = pose.leftAnkle.y - height / 6;
    pointsType2[3].unlock();
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
