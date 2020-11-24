//Declaring Variables
var groundImg,ground;
var shooter,shooterImg;
var axe,axeGif;
var bullets;
var backgroundImg;
var lostImg,tankGif,winImg,bulletImg,heroImg,flowersImg;
var edges;
var score = 0;
var PLAY = 1;
var gameStates = PLAY;
var END = 0;
var burstSound;
var backgroundSound;
var deadImg;
var backgroundWinImg;

function preload(){
  //Load images
  shooterImg =loadImage("/images/superhero.gif");
  deadImg =loadImage("/images/end.png");
  backgroundImg =loadImage("/images/background.gif");
  backgroundWinImg =loadImage("/images/backgoundWinner.jpg");
  lostImg =loadImage("/images/loose.png");
  heroImg =loadImage("/images/won.png");
  winImg =loadImage("/images/winner.jpg");
  tankGif =loadImage("/images/tank.gif");
  flowersImg =loadImage("/images/flowers1.gif");
  axeGif =loadImage("/images/axe.gif");
  bulletImg = loadImage("/images/bullet1.png");
  groundImg = loadImage("/images/ground.gif");
  //Load Sounds
  burstSound = loadSound("burst.mp3");
  backgroundSound = loadSound("Background.mp3");
}

function setup() {
  createCanvas(windowWidth,windowHeight);

  backgroundSound.play();

  //Creating shooter
  shooter = createSprite(width-1200,height-150,50,50);
  shooter.addImage(shooterImg);
  shooter.scale = 1.3;

  flowers = createSprite(width-800,height-450,50,50);
  flowers.addImage(flowersImg);
  flowers.scale = 1.2;
  flowers.visible = false;

  //Creating bullets
  bullets = createSprite(mouseX,mouseY,20,20);
  bullets.addImage("fast",bulletImg);
  bullets.scale = 0;
  bullets.visible = true;
  
  ground = createSprite(width-200,height-50,windowWidth,50);
  ground.velocityX = -20;
  ground.addImage(groundImg);
  //ground.visible = false;
  
  invisibleGround = createSprite(width-700,height-30,windowWidth,50);
  invisibleGround.visible = false;

  ground.depth = shooter.depth;
  ground.depth = ground.depth + 4;
  
  //Create Edge Sprite
  edges = createEdgeSprites();

  //Creating new groups
  axeGroup = new Group();
  //bulletGroup = new Group();
  tankGroup = new Group();
}

function draw() {
  background(backgroundImg);

  textFont("Goudy Old Style");
  stroke("orange");
  fill("yellow");
  textSize(25);
  text("Click any where in the canvas to fire out bullet and protect the shooter from axe and the monsters!!", windowWidth-1300,windowHeight-600);
  text("Score : "+score, windowWidth-200,windowHeight-600);

  if(gameStates === PLAY){
    
      if(ground.x < ground.width/2){
        ground.x = ground.width/2;
      }

      //When key down space pressed
      if(keyDown("space") && shooter.y >= 159) {
          shooter.velocityY = -12;
        }

        
      //Calling Functions
      axeBoostUp();
      trojers();
      
      //if axeGroup is touching bullets
      for (var i = 0;i<axeGroup.length;i++){
        if(axeGroup.get(i).isTouching(bullets)){
            burstSound.play();
            axeGroup.get(i).destroy();
            bullets.destroy();
            score = score + 50;
        }
      }
      
      //if tankGroup is touching bullets
      for (var i = 0;i<tankGroup.length;i++){
        if(tankGroup.get(i).isTouching(bullets)){
          burstSound.play();
          tankGroup.get(i).destroy();
          bullets.destroy();
          score = score + 50;
        }
    }

      //Give shooter gravity
      shooter.velocityY = shooter.velocityY + 0.8;

      //collide shooter with bottom edge
      shooter.collide(invisibleGround);
      tankGroup.collide(invisibleGround);

      //if tankGroup is touching shooter or axeGroup is touching shooter
      if(tankGroup.isTouching(shooter) || axeGroup.isTouching(shooter)){
        gameStates = END;
    }

  } else if(gameStates === END){
    dead = createSprite(width-1200,height-100,50,50);
    dead.addImage(deadImg);
    dead.scale = 0.5;

    ground.velocityX = 0;

    shooter.destroy();

    axeGroup.setVelocityXEach(0);
    tankGroup.setVelocityXEach(0);

    tankGroup.setLifetimeEach(-1);
    axeGroup.setLifetimeEach(-1);

    lost = createSprite(600,150,50,50);
    lost.addImage(lostImg);
    lost.scale= 0.5;
    backgroundSound.stop();
  }

  if(score == 1000 && gameStates===PLAY){
    background(backgroundWinImg);

    ground.visible = false;

    shooter.destroy();

    won1 = createSprite(width-800,height-250,50,50);
    won1.addImage(heroImg);
    won1.scale = 0.6;

    flowers.visible = true;

    axeGroup.setVelocityXEach(0);
    tankGroup.setVelocityXEach(0);

    tankGroup.setLifetimeEach(-1);
    axeGroup.setLifetimeEach(-1);

    tankGroup.destroyEach();
    axeGroup.destroyEach();
  }


  drawSprites();
}
  
function mouseClicked() {
    ground.depth = shooter.depth;
    ground.depth = ground.depth + 5;

    ground.depth = tankGroup.depth;
    ground.depth = ground.depth + 5;

    //Creating Bullets
    bullets = createSprite(mouseX,mouseY,20,20);
    bullets.addImage("fast",bulletImg);
    bullets.scale = 0.1;
    bullets.velocityX = 7;
 
  //Adding bullets in bulletsGroup
  //bulletGroup.add(bullets);
}

function axeBoostUp() {
  //Creating Axe
  if(frameCount % 30 === 0){
    axe = createSprite(width-100,height-20,20,20);
    axe.y = Math.round(random(height-300,height-100));
    axe.addImage(axeGif);
    axe.scale = 0.4;
    axe.velocityX = -3;
    
    //adjust the depth
    axe.depth = shooter.depth;
    axe.depth = axe.depth + 2;
    axe.lifetime = 280;
    
    //Adding axe in axeGroup
    axeGroup.add(axe);
 }
}

function trojers() {
  //Creating Axe
  if(frameCount % 200 === 0){
    //Creating tank
    tank = createSprite(width- 20,height-150,50,50);
    tank.addImage(tankGif);
    tank.scale = 0.7;
    tank.velocityX = -6;

    ground.depth = tank.depth;
    ground.depth = ground.depth + 5;

    tank.lifetime = 280;
    //Adding axe in axeGroup
    tankGroup.add(tank);
 }
}
