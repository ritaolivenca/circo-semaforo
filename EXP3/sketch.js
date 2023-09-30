// Coding Train / Daniel Shiffman
// adapted w/ml5 poseNET example to interactive text representation

const { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
const { GravityBehavior } = toxi.physics2d.behaviors;
const { Vec2D, Rect } = toxi.geom;

let physics;

let particles = [];
let eyes = [];

let springs = [];

let showSprings = false;



function keyPressed() {
  if (key == ' ') {
    showSprings = !showSprings;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  physics = new VerletPhysics2D();

  let bounds = new Rect(0, 0, width, height);
  physics.setWorldBounds(bounds);

  particles.push(new Particle(200, 200));
  particles.push(new Particle(1000, 200));
  particles.push(new Particle(1000, 600));
  particles.push(new Particle(200, 600));


  eyes.push(new Particle(200, 400));
  eyes.push(new Particle(400, 400));
  eyes.push(new Particle(600, 400));
  eyes.push(new Particle(800, 400));
  eyes.push(new Particle(1000, 400));

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
    springs.push(new Spring(particle, eyes[0], 0.01));
    springs.push(new Spring(particle, eyes[1], 0.01));
    springs.push(new Spring(particle, eyes[2], 0.01));
    springs.push(new Spring(particle, eyes[3], 0.01));
    springs.push(new Spring(particle, eyes[4], 0.01));
  }

  springs.push(new Spring(particles[0], particles[2], 0.01));
  springs.push(new Spring(particles[1], particles[3], 0.01));

 
}

function draw() {
  background(255);

  physics.update();

  noStroke();
  if (showSprings) stroke(112, 50, 126, 100);

  noFill();
  if (showSprings) fill(45, 197, 244, 100);
  strokeWeight(2);
  beginShape();
  for (let particle of particles) {
    vertex(particle.x, particle.y);
  }
  endShape(CLOSE);

  beginShape();
  stroke(0);
  vertex(eyes[0].x, eyes[0].y);
  quadraticVertex(eyes[1].x, eyes[1].y, eyes[2].x, eyes[2].y);
  quadraticVertex(eyes[3].x, eyes[3].y, eyes[4].x, eyes[4].y);
  endShape();
  

  //   fill(127, 127);
  //   stroke(0);
  //   strokeWeight(2);
  //   beginShape();
  //   for (let particle of particles) {
  //     vertex(particle.x, particle.y);
  //   }
  //   endShape(CLOSE);

  // for (let particle of particles) {
  //   particle.show();
  // }

  // eyes[0].show();
  // eyes[1].show();
  // eyes[2].show();
  // eyes[3].show();
  // eyes[4].show();
  
  

  // for (let eye of eyes) {
  //   eye.show();
  // }

  if (showSprings) {
    for (let spring of springs) {
      spring.show();
    }
  }

  if (mouseIsPressed) {
    eyes[0].lock();
    eyes[0].x = mouseX;
    eyes[0].y = mouseY;
    eyes[0].unlock();
  }
}
