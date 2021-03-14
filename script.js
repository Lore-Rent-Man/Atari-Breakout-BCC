let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

/* DRAWS A RED SQUARE WITH WIDTH/HEIGHT = 50 AND POSITION X = 20, Y = 40 */
// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

/* DRAWS A GREEN CIRCLE WITH RADIUS 20 AND POSITION X = 240, Y = 160 */
// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// ctx.fillStyle = "green";
// ctx.fill();
// ctx.closePath();

let x = canvas.width/2;
let y = canvas.height-30;

let dx = 2;
let dy = -2;

let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;

let rightPressed = false;
let leftPressed = false;

/* HOW MANY BRICKS THERE ARE IN THE GAME (# of bricks = brickRowCount * brickColumnCount) */
let brickRowCount = 3;
let brickColumnCount = 5;

/* DETERMINES HOW BIG THE BRICK IS */
let brickWidth = 75;
let brickHeight = 20;

/* DETERMINES HOW FAR THE BRICKS SHOULD BE SPREAD OUT FROM ONE ANOTHER */
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

/* BRICK ARRAY */
let bricks = [];
for (let c = 0; c<brickColumnCount; c++)
{
    bricks[c] = [];
    let brickColor;
    for(let r = 0; r<brickRowCount; r++) {
        let randomNumber = getRandomInt(5);
        switch(randomNumber){
            case 0:
                brickColor = "red";
                break;
            case 1:
                brickColor = "green";
                break;
            case 2:
                brickColor = "blue";
                break;
            case 3:
                brickColor = "purple";
                break;
            default:
                brickColor = "orange";
        }
        bricks[c][r] = { x: 0, y: 0, status: 1, color: brickColor};
    }
}

let score = 0;

let ballColor = "#0095DD";
let paddleColor = "#0095DD";

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e){
    if(e.key == "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key == "ArrowLeft")
    {
        leftPressed = true;
    }
}

function keyUpHandler(e){
    if(e.key == "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key == "ArrowLeft"){
        leftPressed = false;
    }
}

function mouseMoveHandler(e){
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth/2;
    }
}

function drawBall(){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}

function drawBricks(){
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            if(bricks[c][r].status == 1){
                let brickX = (c*(brickWidth+brickPadding)) + brickOffsetLeft;
                let brickY = (r*(brickHeight+brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
    for(let c=0; c<brickColumnCount; c++){
        for(let r=0; r<brickRowCount; r++){
            let b = bricks[c][r];
            if(b.status == 1)
            {
                /* CHECKS IF BRICK REPRESENTED BY VARIABLE b AND BALL ARE OVERLAPPING */
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight)
                {
                    dy = -dy;
                    b.status = 0;
                    ballColor = b.color;
                    paddleColor = b.color;
                    score++;
                    if(score == brickRowCount * brickColumnCount){
                        alert("YOU WIN!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    x += dx;
    y += dy;

    if(x + ballRadius > canvas.width || x - 10 < 0){
        dx = -dx;
    }

    if(y - 10 < 0){
        /* IF BALL HITS TOP OF THE CANVAS */
        dy = -dy;
    } else if(y + dy > canvas.height - ballRadius) {
        /* IF BALL IS NEAR THE GROUND */
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        }
        else
        {
            alert("GAME OVER");
            document.location.reload();
            clearInterval(interval);
        }
    }


    if(rightPressed){
        paddleX += 7;
        if(paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed){
        paddleX -= 7;
        if(paddleX < 0){
            paddleX = 0;
        }
    }
}

let interval = setInterval(draw, 10);

