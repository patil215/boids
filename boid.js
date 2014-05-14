var canvas = document.getElementById("boidCanvas");
var ctx = canvas.getContext("2d");

var allBoids = [];

var width = canvas.width;
var height = canvas.height;

var boidWidth = 10;
var boidHeight = 10;
var numBoids = 20;
var boidSpeed = 3;
var distanceKeepAway = 50;
var keepAwayRotation = 0.03;

// higher value = less important
var moveToOthersImportance = 128;
var turnLikeOthersImportance = 128;

var PI = 3.1415;


function initializeBoids() {
    for (var i = 0; i < numBoids; i++) {
        var boid = new Object();
        boid.x = Math.random() * width;
        boid.y = Math.random() * height;
        boid.rotation = Math.random() * 2 * PI;
        boid.speed = boidSpeed;
        allBoids.push(boid);
    }
}

function averageRotation(boids) {
    var total = 0;
    for (var i = 0; i < boids.length; i++) {
        total += boids[i].rotation;
    }
    return total / boids.length;
}

function averageX(boids) {
    var total = 0;
    for (var i = 0; i < boids.length; i++) {
        total += boids[i].x;
    }
    return total / boids.length;
}

function averageY(boids) {
    var total = 0;
    for (var i = 0; i < boids.length; i++) {
        total += boids[i].y;
    }
    return total / boids.length;
}

function turnLikeOthers(boid, boids) {
    var avg = averageRotation(boids);
    boid.rotation += (avg - boid.rotation) / turnLikeOthersImportance;
}

function moveToOthers(boid, boids) {
    var avgX = averageX(boids);
    var avgY = averageY(boids);
    var difX = boid.x - avgX;
    var difY = boid.y - avgY;
    var rotation = Math.atan(difY / difX);
    if (difY < 0 && difX < 0) {
        rotation += PI;
    } else if(difX < 0 && difY > 0) {
        rotation += PI;
    }
    boid.rotation += ((rotation - boid.rotation) / moveToOthersImportance);
}

function keepFromOthers(boid, boids) {
    for (var i = 0; i < boids.length; i++) {
        otherBoid = boids[i];
        if (otherBoid != boid) {
            if (Math.sqrt(Math.pow(boid.x - otherBoid.x, 2) + Math.pow(boid.y - otherBoid.y, 2)) < distanceKeepAway) {
                if (Math.random() > 0.5) {
                    boid.rotation += keepAwayRotation;
                } else {
                    boid.rotation -= keepAwayRotation;
                }
            }
        }
    }
}

function moveBoids() {
    for (var i = 0; i < allBoids.length; i++) {
        boid = allBoids[i];
        turnLikeOthers(boid, allBoids);
        moveToOthers(boid, allBoids);
        keepFromOthers(boid, allBoids);
        var yMove = Math.sin(boid.rotation) * boid.speed;
        var xMove = Math.cos(boid.rotation) * boid.speed;
        boid.x += xMove;
        boid.y += yMove;
        if (boid.x > canvas.width) {
            boid.x = -5;
        }
        if (boid.x < -5) {
            boid.x = canvas.width;
        }
        if (boid.y > canvas.height) {
            boid.y = -5;
        }
        if (boid.y < -5) {
            boid.y = canvas.height;
        }
    }
}

function drawBoids() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    for (var i = 0; i < allBoids.length; i++) {
        boid = allBoids[i];
        ctx.fillRect(boid.x - (boidWidth / 2), boid.y - (boidHeight / 2), boidWidth, boidHeight);
    }

}

initializeBoids();

function main() {
    moveBoids();
    drawBoids();
    requestAnimationFrame(main);
};

requestAnimationFrame(main);