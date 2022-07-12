class Player {
    constructor() {
      this.name = null;
      this.index = null;
      this.positionX = 0;
      this.positionY = 0;
      this.rank = 0;
      this.fuel = 185;
      this.life = 185;
      this.score = 0;
    }
  
    addPlayer() {
      var playerIndex = "players/player" + this.index;
  
      if (this.index === 1) {
        this.positionY = height / 2 - 1150;
      } else {
        this.positionY = height / 2 - 1000;
      }
  
      database.ref(playerIndex).set({
        name: this.name,
        positionX: this.positionX,
        positionY: this.positionY,
        rank: this.rank,
        score: this.score
      });
    }
  
    getDistance() {
      var playerDistanceRef = database.ref("players/player" + this.index);
      playerDistanceRef.on("value", data => {
        var data = data.val();
        this.positionX = data.positionX;
        this.positionY = data.positionY;
      });
    }
  
    getCount() {
      var playerCountRef = database.ref("playerCount");
      playerCountRef.on("value", data => {
        playerCount = data.val();
      });
    }
  
    updateCount(count) {
      database.ref("/").update({
        playerCount: count
      });
    }
  
    update() {
      var playerIndex = "players/player" + this.index;
      database.ref(playerIndex).update({
        positionX: this.positionX,
        positionY: this.positionY,
        rank: this.rank,
        score: this.score,
        life: this.life
      });
    }
  
    static getPlayersInfo() {
      var playerInfoRef = database.ref("players");
      playerInfoRef.on("value", data => {
        allPlayers = data.val();
      });
    }
  
    getplayersAtEnd() {
      database.ref("playersAtEnd").on("value", data => {
        this.rank = data.val();
      });
    }
  
    static updateplayersAtEnd(rank) {
      database.ref("/").update({
        playersAtEnd: rank
      });
    }
  }
  