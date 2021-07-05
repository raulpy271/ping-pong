
var gameArea = {
    cv : document.getElementById("canvas"),
    start : function() {
        this.cv.width = 600;
        this.cv.height = 300;
        this.center = [gameArea.cv.width/2, gameArea.cv.height/2]
        this.ctx = this.cv.getContext("2d");
        this.maxBalls = 5;
        this.tables =  [
          table1 = new table(this.cv.width, 7, "black",  0, 0, [1,-1]),
          table2 = new table(this.cv.width, 7, "black",  0, this.cv.height-7, [1,-1]),
          racket1 = new table(15, 70, "blue", this.cv.width-20, this.center[1], [-1,1]),
          racket2 = new table(15, 70, "blue", 5, this.center[1],[-1, 1] )
          
        ];
        this.balls = [];
        this.bonus = [];
    },
   
    clear : function() {
        this.ctx.clearRect(0, 0, this.cv.width, this.cv.height);
    }
}

var score = {
  playRed: 0,
  playBlue: 0,
  update: function() {
    this.element = document.getElementById("score");
    txt = "| " + this.playRed + " X " + this.playBlue + " |";
    this.element.innerHTML = txt;
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


function Ball() {
  this.x = 0;
  this.y = 0;
  this.speed = [10, 0];
  this.radius = 7;
  this.color = "green";
  this.start = function(newX, newY) {
    this.ctx = gameArea.ctx;
    this.x = newX;
    this.y = newY;
    
    
    this.speed[1] = getRandomInt(1, 11);
    if (getRandomInt(0,2)){this.speed[0] *= (-1)}
    if (getRandomInt(0,2)){this.speed[1] *= (-1)}


    this.ctx.fillStyle=this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.fill();

  };

  this.update = function() {

    this.ctx.clearRect(this.x - this.radius, 
    this.y - this.radius, 2*this.radius, 2*this.radius);
    
    this.x = this.x + this.speed[0];
    this.y = this.y + this.speed[1];

    if ((this.x > gameArea.cv.width || this.x < 0) || 
        (this.y > gameArea.cv.height || this.y < 0)) {
      
      if (this.x < 0) {
        score.playBlue = score.playBlue + 1;
      }
      else if (this.x > gameArea.cv.width) {
        score.playRed = score.playRed + 1;
      }
      newbonus();
      ball.start(gameArea.center[0], gameArea.center[1]);
    }

    else {
    this.ctx.fillStyle=this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    this.ctx.fill();}

  };

  this.crash = function(obj) {

    var crash = crashObj(this, obj, true);

    if (crash) {this.speed = [this.speed[0]*obj.angle[0], this.speed[1]*obj.angle[1] ];}

  }

}

function crashObj(ball, obj, isball) {
  if (isball){

  var lftop = [ball.x - 2*ball.radius, ball.y - 2*ball.radius];
  var rgtop = [ball.x+ 2*ball.radius, ball.y - 2*ball.radius];
  var lfbottom = [ball.x- 2*ball.radius, ball.y+2*ball.radius];
  var rgbottom = [ball.x+2*ball.radius,ball.y+2*ball.radius];
  } else {
  var lftop = [ball.x, ball.y];
  var rgtop = [ball.x+ball.width, ball.y];
  var lfbottom = [ball.x, ball.y+ball.height];
  var rgbottom = [ball.x+ball.width, ball.y+ball.height];

  }
  var objlftop = [obj.x, obj.y];
  var objrgtop = [obj.x+obj.width, obj.y];
  var objlfbottom = [obj.x, obj.y+obj.height];
  var objrgbottom = [obj.x+obj.width, obj.y+obj.height];
    
  var crash = ((rgtop[0] > objlfbottom[0] && rgtop[0] < objrgbottom[0]) || 
            (lftop[0] < objrgbottom[0] && lftop[0] > objlfbottom[0])) &&
            ((lftop[1] < objlfbottom[1] && lftop[1] > objlftop[1]) || 
            (lfbottom[1] > objlftop[1]) && lfbottom[1] < objlfbottom[1])

  if (crash) {return true;} else {return false;}

}

function newball() {
  gameArea.balls.push(new Ball());
  var index = gameArea.balls.length-1;
  
  if (gameArea.bonus[0].x == 10) {
    gameArea.balls[index].start(gameArea.bonus[0].x+20, gameArea.bonus[0].y);
    gameArea.balls[index].speed[0] = 10;
  } else {
    gameArea.balls[index].start(gameArea.bonus[0].x-20, gameArea.bonus[0].y);
    gameArea.balls[index].speed[0] = -10;
  }
  gameArea.balls[index].speed[1] = getRandomInt(1, 11);
  if (getRandomInt(0, 2)){
    gameArea.balls[index].speed[1] *= (-1)
  }
}

function newbonus() {
  var x = 10;
  
  
  var racket;
  var distupRacket;
  var distRacket;
  var y;
  var color = "yellow"
  
  if (getRandomInt(1, 10) <= gameArea.balls.length && 
  gameArea.bonus.length == 0 && gameArea.balls.length < gameArea.maxBalls) {
    
    racket = gameArea.tables[3];
    
    if(getRandomInt(0, 2)) {
      racket = gameArea.tables[2];
      x = gameArea.cv.width-20;
    }
    
    distupRacket = racket.y;
    distRacket = gameArea.cv.height - (racket.y + racket.height)
    
    if (distupRacket > distRacket) {
      y = getRandomInt(10, distupRacket - 10)
    } else {
      y = getRandomInt(gameArea.cv.height - 
      distRacket, gameArea.cv.height - 10)
    }
    gameArea.bonus.push(new table(10, 10, color, x, y, [-1, 1]))
  }

}

function table(width, height, color, x, y, angle) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.color = color;
  ctx = gameArea.ctx;
  ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.width, this.height);
}


function updateRacket(racket, newX, newY) {
  
  if (newY > 1 && newY < gameArea.cv.height - racket.height -5){
    ctx = gameArea.ctx;
    ctx.clearRect(racket.x,racket.y,racket.width,racket.height);
    racket.x = newX;
    racket.y = newY;
    ctx.fillStyle = racket.color;
    ctx.fillRect(newX, newY, racket.width, racket.height);
  }
}


function updategame(){
  
  if (gameArea.bonus[0] && 
  (crashObj(gameArea.bonus[0], gameArea.tables[3], false) ||
  crashObj(gameArea.bonus[0], gameArea.tables[2], false))) {
    newball()
    gameArea.bonus = []
  }

  for (ball of gameArea.balls){
    ball.update();
    for (var i = 0; i < gameArea.tables.length; i++) {
      ball.crash(gameArea.tables[i]);
    }
  }

  score.update();

  
}

function startgame(){
  gameArea.start();
  gameArea.balls.push(new Ball())
  for (ball of gameArea.balls){
    ball.start(gameArea.center[0], gameArea.center[1]);
  }
  
  setInterval(updategame,30);

  window.addEventListener("keydown", function(key){
    velocity = 40; 
    keys = {up:38, down:40,w: 87, s: 83}
    if (key.keyCode == keys.up) {
      updateRacket(gameArea.tables[2], gameArea.tables[2].x, gameArea.tables[2].y - velocity);
    } else if (key.keyCode == keys.down) {
      updateRacket(gameArea.tables[2], gameArea.tables[2].x, gameArea.tables[2].y + velocity);
    }
    else if (key.keyCode == keys.w) {
      updateRacket(gameArea.tables[3], gameArea.tables[3].x, gameArea.tables[3].y - velocity);
    } else if (key.keyCode == keys.s) {
      updateRacket(gameArea.tables[3], gameArea.tables[3].x, gameArea.tables[3].y + velocity);
    }

  })

}
