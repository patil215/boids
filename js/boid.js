var canvas = document.getElementById("boid-canvas");
var ctx = canvas.getContext("2d");

var allBoids = [];

var width = canvas.width;
var height = canvas.height;

var keepAwayRotation = 0.01;
var boidSize = 5;
var numBoids = 50;
var boidSpeed = 4;
var distanceKeepAway = 100;
var wallTurnAmount = .01;
var wallTurnDistance = 100;
var moveToOthersImportance = 0.008;
var turnLikeOthersImportance = 0.008;

var PI = 3.1415;


function initializeBoids() {
    for (var i = 0; i < numBoids; i++) {
        var boid = new Object();
        boid.x = Math.random() * width;
        boid.y = Math.random() * height;
        boid.rotation = Math.random() * 2 * PI;
        boid.speed = boidSpeed;
        boid.r = 128;
        boid.g = 128;
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
    boid.rotation += (avg - boid.rotation) * turnLikeOthersImportance;
}

function moveToOthers(boid, boids) {
    var avgX = averageX(boids);
    var avgY = averageY(boids);
    var difX = avgX - boid.x;
    var difY = avgY - boid.y;
    var rotation = Math.atan(difY / difX);
    if (difY < 0 && difX < 0) {
        rotation += PI;
    } else if (difX < 0 && difY > 0) {
        rotation += PI;
    }
    boid.rotation += ((rotation - boid.rotation) * moveToOthersImportance);
}

function keepFromOthers(boid, boids) {
    // to find shortest distance for color purposes
    var shortestDistance = 100000;
    for (var i = 0; i < boids.length; i++) {
        otherBoid = boids[i];
        if (otherBoid != boid) {
            var dist = Math.sqrt(Math.pow(boid.x - otherBoid.x, 2) + Math.pow(boid.y - otherBoid.y, 2));
            if (dist < distanceKeepAway) {
                if(dist < shortestDistance) {
                    shortestDistance = dist;
                }
                boid.rotation += (Math.random()) * keepAwayRotation;
            }
        }
    }

    
    // Define what distance is considered 'green'
    var distanceGreen = 50;

    // Scale shortest distance to rgb value, sqrt for quadratic scaling
    var scale = ((shortestDistance / distanceGreen)) * 256;
    // Closer = higher r (more red)
    boid.r = Math.round(256 - scale);
    // Further = lower g (more green)
    boid.g = Math.round(scale);
}

function moveBoids() {
    // create a copy so the moving boids don't mess stuff up
    var copyBoids = allBoids.slice(0);
    for (var i = 0; i < allBoids.length; i++) {
        boid = allBoids[i];
        turnLikeOthers(boid, copyBoids);
        moveToOthers(boid, copyBoids);
        keepFromOthers(boid, copyBoids);
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

    ctx.fillStyle = "rgba(256,256,256,.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < allBoids.length; i++) {
        boid = allBoids[i];
        ctx.beginPath();
        var r = boid.r;
        var g = boid.g;
        var colorString = 'rgb(' + r + ',' + g + ',0)';
        ctx.fillStyle = colorString;
        ctx.strokeStyle = colorString;
        ctx.arc(boid.x - (boidSize / 2), boid.y - (boidSize / 2), boidSize, 0, 2*PI);
        ctx.fill();
        ctx.stroke();
    }

}

initializeBoids();

function main() {
    moveBoids();
    drawBoids();
    requestAnimationFrame(main);
};

requestAnimationFrame(main);