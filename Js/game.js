class Game {
    constructor(){
        this.resetTitle = createElement("h2");
        this.resetButton = createButton("");
    
        this.leadeboardTitle = createElement("h2");
    
        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");
    }

    getState() {
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function(data) {
          gameState = data.val();
        });
      }
      update(state) {
        database.ref("/").update({
          gameState: state
        });
      }

      start(){
        player = new Player();
        playerCount = player.getCount();
    
        form = new Form();
        form.display();
    
        player1 = createSprite(150 , height - 1300);
        player1.addImage("player1", playerImage);
        player1.scale = 0.5;
        player1.addImage("blast", BlastImage);
    
        player1.debug = true;

        player2 = createSprite(width-150, height - 1200);
        player2.addImage("player2", playerImage);
        player2.scale = 0.5;
        player2.addImage("blast", BlastImage);
    
        players = [player1, player2];

        fuels = new Group();
        Coins = new Group();

        monsters= new Group();
        bullets = new Group();

        var monstersPositions = [
            { x: width / 2 + 250, y: height - 800, image: monster2_img },
            { x: width / 2 - 150, y: height - 1300, image: monster1_img },
            { x: width / 2 + 250, y: height - 1800, image: monster1_img },
            { x: width / 2 - 180, y: height - 2300, image: monster2_img },
            { x: width / 2, y: height - 2800, image: monster2_img },
            { x: width / 2 - 180, y: height - 3300, image: monster1_img },
            { x: width / 2 + 180, y: height - 3300, image: monster2_img },
            { x: width / 2 + 250, y: height - 3800, image: monster2_img },
            { x: width / 2 - 150, y: height - 4300, image: monster1_img },
            { x: width / 2 + 250, y: height - 4800, image: monster2_img },
            { x: width / 2, y: height - 5300, image: monster1_img },
            { x: width / 2 - 180, y: height - 5500, image: monster2_img }
          ];
          this.addSprites(fuels, 4, fuelImage, 0.02);
          this.addSprites(Coins, 4, coinImage, 0.02);
          this.addSprites(monsters, monstersPositions.length, monster1_img, 0.04, monstersPositions);
    }


    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
        for (var i = 0; i < numberOfSprites; i++) {
          var x, y;
    
          if (positions.length > 0) {
            x = positions[i].x;
            y = positions[i].y;
            spriteImage = positions[i].image;
          } else {
            x = random(width / 2 + 150, width / 2 - 150);
            y = random(-height * 4.5, height - 400);
          }
          var sprite = createSprite(x, y);
          sprite.addImage("sprite", spriteImage);
    
          sprite.scale = scale;
          spriteGroup.add(sprite);
        }
      }

      handleElements() {
        form.hide();
        form.titleImg.position(40, 50);
        form.titleImg.class("gameTitleAfterEffect");
    
        this.resetTitle.html("Reset Game");
        this.resetTitle.class("resetText");
        this.resetTitle.position(width / 2 - 1200, 40);
    
        this.resetButton.class("resetButton");
        this.resetButton.position(width / 2 , height/2);
    
        this.leadeboardTitle.html("Leaderboard");
        this.leadeboardTitle.class("resetText");
        this.leadeboardTitle.position(width / 3 - 60, 40);
    
        this.leader1.class("leadersText");
        this.leader1.position(width / 3 - 50, 80);
    
        this.leader2.class("leadersText");
        this.leader2.position(width / 3 - 50, 130);
      }
    
      play(){
        this.handleElements();
        this.handleResetButton();

        Player.getPlayersInfo();
        //player.getplayerAtEnd();

        if (allPlayers !== undefined) {
            var index = 0;
            for (var plr in allPlayers) {
              //add 1 to the index for every loop
              index = index + 1;
      
              //use data form the database to display the cars in x and y direction
              var x = allPlayers[plr].positionX;
              var y = height - allPlayers[plr].positionY;

              var currentlife = allPlayers[plr].life;
              if(currentlife<=0){
               // players[index-1].changeImage("blast")
               // players[index-1].scale = 0.3;
              }
              players[index - 1].position.x = x;
              players[index - 1].position.y = y;  
              
              if (index === player.index) {
                stroke(10);
                fill("blue");
                ellipse(x, y, 60, 60);

                this.handleFuel(index);
                this.handleCoins(index);``
               // this.handlemonstersCollision(index);
                this.handleplayer1collisionwithplayer2(index);
                if(player.life<= 0){
                //this.blast = true;
                this.playerMoving = false;
                   }
          // Changing camera position in y direction
          camera.position.y = players[index - 1].position.y;
        }
      }
      if (this.playerMoving) {
        player.positionY += 5;
        player.update();
      }
       // handling keyboard events
       this.handlePlayerControls();

       // Finshing Line
       //const finshLine = height * 6 - 100;
 
       //if (player.positionY > finshLine) {
        // gameState = 2;
        // player.rank += 1;
        // Player.updateplayerAtEnd(player.rank);
         //player.update();
         //this.showRank();
       //}

       }
       drawSprites();
      }
      
      handleResetButton() {
        this.resetButton.mousePressed(() => {
          database.ref("/").set({
            playerCount: 0,
            gameState: 0,
            players: {},
           players: 0
          });
          window.location.reload();
        });
      }
      showLife() {
        push();
        image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
        fill("white");
        rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
        fill("#f50057");
        rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
        noStroke();
        pop();
      }
    
      showFuelBar() {
        push();
        image(fuelImage, width / 2 - 130, height - player.positionY - 250, 20, 20);
        fill("white");
        rect(width / 2 - 100, height - player.positionY - 250, 185, 20);
        fill("#ffc400");
        rect(width / 2 - 100, height - player.positionY - 250, player.fuel, 20);
        noStroke();
        pop();
      }
    
      showLeaderboard() {
        var leader1, leader2;
        var players = Object.values(allPlayers);
        if (
          (players[0].rank === 0 && players[1].rank === 0) ||
          players[0].rank === 1
        ) {
          // &emsp;    This tag is used for displaying four spaces.
          leader1 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
    
          leader2 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
        }
    
        if (players[1].rank === 1) {
          leader1 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
    
          leader2 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
        }
    
        this.leader1.html(leader1);
        this.leader2.html(leader2);
      }
    
      handlePlayerControls() {
        if(!this.blast){
    
        
        if (keyIsDown(UP_ARROW)) {
          this.playerMoving = true;
          player.positionX += 10;
          player.update();
        }
    
        if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
          this.leftKeyActive = true;
          player.positionX -= 5;
          player.update();
        }
    
        if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
          this.leftKeyActive = false;
          player.positionX += 5;
          player.update();
          }


        }
      }
    
      handleFuel(index) {
        // Adding fuel
        players[index - 1].overlap(fuels, function(collector, collected) {
          player.fuel = 185;
          //collected is the sprite in the group collectibles that triggered
          //the event
          collected.remove();
        });
    
        // Reducing Player car fuel
        if (player.fuel > 0 && this.playerMoving) {
          player.fuel -= 0.3;
        }
    
        if (player.fuel <= 0) {
          gameState = 2;
          this.gameOver();
        }
      }
    
      handleCoins(index) {
        players[index - 1].overlap(Coins, function(collector, collected) {
          player.score += 21;
          player.update();
          //collected is the sprite in the group collectibles that triggered
          //the event
          collected.remove();
        });
      }

    shootBullet(){
        bullet= createSprite(150, width/2, 50,20)
        bullet.y= gun.y-20
        bullet.addImage(bulletImg)
        bullet.scale=0.12
        bullet.velocityX= 7
        bullets.add(bullet)
      }
    
      handleObstacleCollision(index) {
        if (players[index - 1].collide(obstacles)) {
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
    
          //Reducing Player Life
          if (player.life > 0) {
            player.life -= 185 / 4;
          }
    
          player.update();
        }
      }
    
      showRank() {
        swal({
          title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
          text: "You reached the finish line successfully",
          imageUrl:
            "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize: "100x100",
          confirmButtonText: "Ok"
        });
      }
    
      gameOver() {
        swal({
          title: `Game Over`,
          text: "Oops you lost the race....!!!",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
          imageSize: "100x100",
          confirmButtonText: "Thanks For Playing"
        });
      }
      handleplayer1collisionwithplayer2(index) {
       if(index === 1){
        if(players[index-1].collide(players[1])){
          if(this.leftKeyActive){
            player.positionX += 100
          }
          else{
            player.positionX -= 100
          }
          if(player.life>0){
            player.life -= 185/5;
          }
          player.update();
        }
       }
       if(index === 2){
        if(players[index-1].collide(players[0])){
          if(this.leftKeyActive){
            player.positionX += 100
          }
          else{
            player.positionX-= 100
          }
          if(player.life>0){
            player.life -= 185/4
          }
          player.update();
        }
       }
      }
    }
    