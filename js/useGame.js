import { useLoader } from "./useLoader.js";
import $store from "./useStore.js";
import { initCharacters, updateCharacter } from "./useCharacter.js";
import { getTimer, getRandomNumber } from "./useHelper.js";
import confetti from './confetti.js'

// refer characters variable to global variable
const characters = $store.characters;

// refer options variable to global variable
const options = $store.options;

const _intervals = [];
const _timer = getTimer(options.timer);
const _randomTime = _timer - options.PREPARE_WIN_TIME;

let _stage, _canvasWidth, _canvasHeight, _loader;

let river, land, startLine, endLine, winner;

function init() {
  _stage = new createjs.Stage(options.ele);
  _canvasWidth = _stage.canvas.width;
  _canvasHeight = _stage.canvas.height;
  _loader = useLoader(handleComplete);
}

function handleComplete() {
  // define landImg, land
  var landImg = _loader.getResult("land");
  land = new createjs.Shape();
  land.graphics
    .beginBitmapFill(landImg)
    .drawRect(0, 0, _canvasWidth + landImg.width, landImg.height);
  land.tileW = landImg.width;
  land.y = 0;
  land.cache(0, 0, _canvasWidth + landImg.width, landImg.height);

  // define riverImg, river
  var riverImg = _loader.getResult("river");
  river = new createjs.Shape();
  river.graphics
    .beginBitmapFill(riverImg)
    .drawRect(0, 0, _canvasWidth + riverImg.width, riverImg.height);
  river.tileW = riverImg.width;
  river.y = 30;
  river.cache(0, 0, _canvasWidth + riverImg.width, riverImg.height);

  _stage.addChild(land, river);

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.addEventListener("tick", tick);
}

async function prepare() {
  // Generate characters
  await initCharacters();

  // Draw start_line, end_line
  startLine = new createjs.Bitmap(_loader.getResult("start_line"));
  startLine.x = 180;
  startLine.y = 120;

  endLine = new createjs.Bitmap(_loader.getResult("end_line"));
  endLine.x = _canvasWidth;
  endLine.y = 120;

  _stage.addChild(startLine, endLine);

  // Draw characters
  for (var i = characters.length - 1; i >= 0; i--) {
    let character = characters[i];
    var container = new createjs.Container();

    let duck = new createjs.Bitmap(_loader.getResult("duck" + ((i % 11) + 1)));
    container.addChild(duck);

    if (options.isShowNameBox) {
      let boxName = new createjs.Bitmap(_loader.getResult("box_name"));
      boxName.x = duck.x - 80;
      boxName.y = duck.y - 20;

      let avatar = new createjs.Bitmap(character.avatar);
      avatar.x = duck.x - 66;
      avatar.y = duck.y - 18;

      var name = new createjs.Text(character.shortName, "14px Arial", "#000");
      name.x = duck.x - 70;
      name.y = duck.y + 32;
      name.textBaseline = "alphabetic";

      container.addChild(avatar, boxName, name);
    } else {
      var circle = new createjs.Shape();
      circle.graphics.beginFill("white").drawCircle(0, 0, 15);
      circle.x = duck.x + 50;
      circle.y = duck.y + 70;

      var id = new createjs.Text(character.id, "18px Arial", "#000");
      id.x = duck.x + 42;
      id.y = duck.y + 60;
      id.textBaseline = "alphabetic";

      container.addChild(circle, id);
    }

    container.x = character.x + i / 100;
    container.y = character.y;

    characters[i].target = container;

    _stage.addChild(container);
    // _stage.update();
  }

  bounce();
}

function tick(event) {
  var deltaS = event.delta / 1000;

  river.x = (river.x - deltaS * 300) % river.tileW;

  if (options.status == "playing") {
    land.x = (land.x - deltaS * 100) % land.tileW;
  }

  _stage.update(event);
}

function start() {
  options.status = "playing";
  clearAllIntervals();
  move(startLine, { x: -500 }, 3000);

  randomSwim();

  if (options.mode == "random") {
    modeRandom();
  } else {
    modeManual();
  }
}

function modeRandom() {
  _intervals["random"] = setInterval(() => {
    randomSwim(true);
  }, options.DELAY_TIME);

  setTimeout(() => {
    _intervals["setWinner"] = setInterval(() => {
      console.log("setWinner");
      setWinner();
    }, _randomTime);
  });
}

function modeManual() {
  _intervals["random"] = setInterval(() => {
    randomSwim(true);
  }, options.DELAY_TIME);
}

function restartGame() {
  clearAllIntervals();
}

function move(object, params, time) {
  createjs.Tween.get(object).to(params, time);
}

function randomSwim(
  isLargeRange = false,
  isNegativePriority = false,
  excludeCharacters = null,
  delayTime = options.DELAY_TIME
) {
  for (var i = 0; i < characters.length; i++) {
    let character = characters[i];
    if (!(excludeCharacters && excludeCharacters.includes(character.id))) {
      let x = getValidX(character, isLargeRange, isNegativePriority);
      isNegativePriority ? console.log("x", x) : "";
      characterSwim(character, x, delayTime);
    }
  }
}

function characterSwim(character, x, delayTime) {
  createjs.Tween.get(character.target, { loop: false }).to(
    { x: character.x + x },
    delayTime
  );
  // Update x position for the next
  character.x += x;
}

function getValidX(character, isLargeRange, isNegativePriority) {
  let x = getRandomX(isLargeRange, isNegativePriority);
  if (x + character.x > Math.floor(options.MAX_PERCENT_X * _canvasWidth)) {
    return getValidX(character, isLargeRange, true);
  }
  return x;
}

function getRandomX(isLargeRange, isNegativePriority) {
  let x = 0;
  if (isLargeRange) {
    if (isNegativePriority) {
      x = 20 * getRandomNumber(-10, -5) - getRandomNumber(0, 20);
    } else {
      x = 10 * getRandomNumber(-5, 10) + getRandomNumber(-50, 100);
    }
  } else {
    if (isNegativePriority) {
      x = 5 * getRandomNumber(-5, 0) + getRandomNumber(-50, 10);
    } else {
      x = 5 * getRandomNumber(-5, 5) + getRandomNumber(-50, 50);
    }
  }
  return Math.floor(x);
}

function clearAllIntervals() {
  clearInterval(_intervals["random"]);
  clearInterval(_intervals["prepare"]);
  clearInterval(_intervals["setWinner"]);
}

function prepareWinner(winner) {
  clearInterval(_intervals["random"]);

  randomSwim(true, true, [winner.id], options.DELAY_TIME);

  _intervals["prepare"] = setInterval(() => {
    randomSwim(true, true, [winner.id], options.DELAY_TIME);
  }, options.DELAY_TIME);

  const endLineW = endLine.getBounds().width;
  const endLineH = endLine.getBounds().height;

  const endLineY = _canvasHeight.value - endLineH - 10;
  const distance = endLineW * (1 - (winner.y - endLineY) / endLineH);
  const elDistanceToMid = Math.floor(_canvasWidth / 2 + distance);
  const cwDistanceToMid = Math.floor(_canvasWidth / 2 - winner.x - 105 / 2); //???

  move(endLine, { x: _canvasWidth / 2 - distance }, options.PREPARE_WIN_TIME);
  characterSwim(winner, cwDistanceToMid, options.PREPARE_WIN_TIME);
  move(endLine, { x: -endLineW }, options.PREPARE_WIN_TIME * 2);
  // endLineX.value = _canvasWidth - elDistanceToMid;

  setTimeout(() => {
    console.log("updateEndX");
    updateEndX();
    gameCompleted();
  }, options.PREPARE_WIN_TIME);
}

function updateEndX() {
  for (var i = 0; i < characters.length; i++) {
    const character = characters[i];
    const currentX = Math.floor(character.target.x);
    character.endX = currentX;
    character.distance = currentX - character.startX;
    updateCharacter(character);
  }
}

function setWinner(id = null) {
  if (id) {
    winner = getCharacter(id);
  } else {
    const i = getRandomNumber(0, characters.length - 1);
    winner = characters[i];
    console.log("Winner: ", winner);
  }

  if (winner && winner !== undefined) {
    prepareWinner(winner);
    clearInterval(_intervals["setWinner"]);
  }
}

function getWinCharacters() {
  return characters.sort((a, b) => {
    return b.distance - a.distance;
  });
}

function gameCompleted() {
  confetti();
  setTimeout(() => {
    clearAllIntervals();
  }, 5000);
}

function showWinner(isShow) {
  if (isShow === undefined) {
    isShow = true;
  }
  options.isShowWinner = isShow;
}

function bounce() {
  setInterval(() => {
    for (var i = 0; i < characters.length; i++) {
      let character = characters[i];
      if (character.target) {
        createjs.Tween.get(character.target).to(
          {
            rotation: getRandomNumber(-2, 3),
            y: character.startY + getRandomNumber(-4, 8),
          },
          500
        );
      }
    }
  }, 500);
}

export default {
  options,
  init,
  prepare,
  start,
  showWinner,
  getWinCharacters,
};
