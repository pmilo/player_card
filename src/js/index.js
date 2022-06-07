// Global Variables

const DOMelements = {
  playerCard: document.querySelector(".player-card"),
  playerMenu: document.querySelector(".player-menu"),
  menuDefault: document.querySelector(".default"),
  playerPhoto: document.querySelector(".photo-wrapper img"),
  playerCrest: document.querySelector(".crest-wrapper img"),
  playerName: document.querySelector(".stats h1"),
  playerPosition: document.querySelector(".stats h2"),
  playerApps: document.querySelector(".apps"),
  playerGoals: document.querySelector(".goals"),
  playerAssists: document.querySelector(".assists"),
  playerGPM: document.querySelector(".gpm"),
  playerPPM: document.querySelector(".ppm"),
};

const DOMstrings = {
  playerMenu: ".player-menu",
  navRow: ".nav-row",
};

let state = {};

// =============================================================================

// MODAL

// =============================================================================

class Players {

  constructor() {
    this.playerData = [];
  }

  async getPlayerData() {

    try {

      let response = await fetch("../data/player-stats.json");
      let { players } = await response.json();
      this.playerData = players;

    } catch (error) {
      console.log(error);
    }
  }

  getPlayer(id) {
    for (const obj of this.playerData) {
      if (obj.player.id == id) return obj;
    }
  }

  randomIndex(min, max) {
    return Math.floor(Math.random() * (4 - 0) + 0.6);
  }

  calcGPM(apps, goals) {
    let GPM = "";
    GPM = (goals / apps).toFixed(2);
    return GPM;
  }

  calcPPM(fwdPasses, backPasses, minsPlayed) {
    let PPM = "";
    PPM = ((fwdPasses + backPasses) / minsPlayed).toFixed(2);
    return PPM;
  }
}

// =============================================================================

//  UI

// =============================================================================

class playersView {

  renderPlayerMenu(playersArr) {
    // build select options markup string
    let markup = `<option class="nav-row" value=0 selected="selected">Select a player...</option>`;

    // append option markup string for each player object in playersArr
    playersArr.forEach((playerObj) => {
      markup += `<option class="nav-row" value=${playerObj.player.id}>${playerObj.player.name.first} ${playerObj.player.name.last}</option>`;
    });

    // add options markup to select menu
    DOMelements.playerMenu.innerHTML = markup;
  }

  addSelectListener() {
    // get select element
    const selectEl = document.querySelector(DOMstrings.playerMenu);

    // add event listener to select element
    selectEl.addEventListener("change", (e) => {

      // get current select element value (player id)  
      const id = document.querySelector(DOMstrings.playerMenu).value;

      // return player object with matching player id @ state.players.playerData
      const playerFound = state.players.getPlayer(id);

      // if player object found, pass into updpatePlayerCard method to update player card
      if (playerFound) this.updatePlayerCard(playerFound)
    })
  }


  updatePlayerCard(playerObj) {

    let position = "";

    switch (playerObj.player.info.position) {
      case "F":
        position = "Forward";
        break;
      case "M":
        position = "Midfielder";
        break;
      case "D":
        position = "Defender";
        break;
    }

    // define player stats object template
    let statsTemplateObj = {
      goals: 0,
      goal_assist: 0,
      appearances: 0,
      fwd_pass: 0,
      backward_pass: 0,
      mins_played: 0,
    };

    // assign player stats values to stats template object 
    playerObj.stats.forEach((obj) => {
      statsTemplateObj[obj.name] = obj.value;
    });

    // deconstruct updated stats template object
    const {
      goals,
      goal_assist: assists,
      appearances: apps,
      fwd_pass: fwdPasses,
      backward_pass: backPasses,
      mins_played: minsPlayed,
    } = statsTemplateObj;

    // update player card with player stats data
    DOMelements.playerPhoto.src = `assets/p${playerObj.player.id}.png`;
    DOMelements.playerCrest.src = `assets/crests/${playerObj.player.currentTeam.shortName}.png`;
    DOMelements.playerName.innerHTML = `${playerObj.player.name.first} ${playerObj.player.name.last}`;
    DOMelements.playerPosition.innerHTML = position;
    DOMelements.playerApps.innerHTML = apps;
    DOMelements.playerGoals.innerHTML = goals;
    DOMelements.playerAssists.innerHTML = assists;
    DOMelements.playerGPM.innerHTML = state.players.calcGPM(apps, goals);
    DOMelements.playerPPM.innerHTML = state.players.calcPPM(
      fwdPasses,
      backPasses,
      minsPlayed
    );
  }
}

// =============================================================================

//  EXECUTION

// =============================================================================

async function init() {

   // instanciate Players class to access methods
   state.players = new Players();
   
   // get player data & add to Players modal
   await state.players.getPlayerData();
   
   // instanciate playersView class to access methods
   state.playersView = new playersView();
   
   // get player object from state with randomized index
   const randomPlayerObj = state.players.playerData[state.players.randomIndex(0, 4)];
   
   // use random player data object to update player card
   state.playersView.updatePlayerCard(randomPlayerObj);
   
   // render player menu options
   state.playersView.renderPlayerMenu(state.players.playerData);
   
   // add player menu event listener
   state.playersView.addSelectListener();
}

// init component
init();



