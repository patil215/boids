var canvas = document.getElementById("boidCanvas");
var ctx = canvas.getContext("2d");

var allBoids = [];

var width = canvas.width;
var height = canvas.height;

function initializeBoids() {
    for (var i = 0; i < 20; i++) {
        var boid = new Object();
        boid.x = Math.random() * 400;
        boid.y = Math.random() * 400;
        boid.rotation = Math.random() * 2 * 3.1415;
        boid.speed = 3;
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
    boid.rotation += (avg - boid.rotation) / 16;
}

function moveToOthers(boid, boids) {
    var avgX = averageX(boids);
    var avgY = averageY(boids);
    var difX = boid.x - avgX;
    var difY = boid.y - avgY;
    var rotation = Math.atan(difY / difX);
    if (difY < 0 || difX < 0) {
        rotation += 3.1415;
    }
    boid.rotation += ((rotation - boid.rotation) / 16);
}

function keepFromOthers(boid, boids) {
    for (var i = 0; i < boids.length; i++) {
        otherBoid = boids[i];
        if (otherBoid != boid) {
            if (Math.sqrt(Math.pow(boid.x - otherBoid.x, 2) + Math.pow(boid.y - otherBoid.y, 2)) < 50) {
                if (Math.random() > 0.5) {
                    boid.rotation += 0.03;
                } else {
                    boid.rotation -= 0.03;
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
            boid.x = -10;
        }
        if (boid.x < -10) {
            boid.x = canvas.width;
        }
        if (boid.y > canvas.height) {
            boid.y = -10;
        }
        if (boid.y < -10) {
            boid.y = canvas.height;
        }
    }
}

function drawBoids() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
    for (var i = 0; i < allBoids.length; i++) {
        boid = allBoids[i];
        ctx.fillRect(boid.x, boid.y, 10, 10);
    }

}

initializeBoids();

function main() {
    moveBoids();
    drawBoids();
    requestAnimationFrame(main);
};

requestAnimationFrame(main);