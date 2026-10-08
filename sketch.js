/*
Lesson 4.1 Homework - BodyPose Game
Based on the class 4.1 code, built from the ml5 webcam example
and the p5 example "Motion: Circle Collision".
Homework adds a 45 second survival timer using second()
and "You Win" / "You Lose" text based on the p5 example "Typography: Words".
The ml5 names are updated to the current ml5 library
(ml5.poseNet became ml5.bodyPose, keypoint.position.x became keypoint.x).
*/

let video;
let bodyPose;
let poses = [];
let balls = [];

let startSecond;     
let surviveTime = 45;
let gameResult = "";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  bodyPose = ml5.bodyPose(modelReady);
  video.hide();
  noLoop();
}

function makeBalls(){
  const redC = color(255,0,0);
  const greenC = color(0,255,0);
  const blueC = color(0,0,255);

  balls.push(new Ball(100, 400, 40, redC));
  balls.push(new Ball(-700, 400, 20, redC));
  balls.push(new Ball(700, 400, 40, greenC));
  balls.push(new Ball(-700, 400, 20, greenC));
  balls.push(new Ball(500, 400, 40, blueC));
  balls.push(new Ball(-700, 400, 20, blueC));
}

function modelReady() {
  bodyPose.detectStart(video, gotPoses);
  makeBalls();
  startSecond = second();
  loop();
}

function gotPoses(results) {
  poses = results;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  video.size(width, height);
}

function mousePressed() {
    let fs = fullscreen();
    fullscreen(!fs);
}

function draw() {
  push();
  scale(-1,1);
  translate(-width,0);
  image(video, 0, 0, width, height);
  drawWristAndNose();

  if (balls.length > 0) {
    if (balls[0].popped == balls[2].popped &&
        balls[2].popped == balls[4].popped &&
        balls[4].popped == true) {
      print("You Lose");
      gameResult = "You Lose";
    }

    let secondsPlayed = second() - startSecond;
    if (secondsPlayed < 0) {
      secondsPlayed = secondsPlayed + 60;
    }
    if (gameResult == "" && secondsPlayed >= surviveTime) {
      print("You Win");
      gameResult = "You Win";
    }

    moveBallAndTest(0, 1);
    moveBallAndTest(2, 3);
    moveBallAndTest(4, 5);
  }
  pop();

  if (gameResult != "") {
    background(0);
    fill(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text(gameResult, width/2, height/2);
    noLoop();
  }
}

function moveBallAndTest(index, pair){
    let b = balls[index];
    b.update();
    b.display();
    b.checkBoundaryCollision();
    b.checkCollisionAndDelete(balls[pair]);
}

function drawWristAndNose() {
  if (poses.length > 0) {
    let pose = poses[0]; //only care about first player

    let nose = pose.keypoints[0];
    let lWrist = pose.keypoints[9];
    let rWrist = pose.keypoints[10];

    drawPoint(1, nose, color(255,0,0));
    drawPoint(3, lWrist, color(0,255,0));
    drawPoint(5, rWrist, color(0,0,255));
  }
}

function drawPoint(i, keypoint, col) {
  balls[i].moveTo(keypoint.x, keypoint.y);
  balls[i].display();
}
