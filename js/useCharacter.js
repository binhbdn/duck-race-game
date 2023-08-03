import { getRandomNumber } from './useHelper.js';
import $store from './useStore.js';

// refer characters variable to global variable
// const characters = [];
const characters = $store.characters

async function initCharacters(numberCharacter) {
  if (numberCharacter) {
    // Random characters
    for (let i = 0; i < numberCharacter; i++) {
      const data = {
        id: `${i + 1}`,
        name: `Name ${i}`,
        platform: "",
        type: getRandomNumber(1, 11),
        avatar: "",
      };
      addCharacterFromList(data, i, numberCharacter);
    }
  } else {
    console.log("characters.length", characters.length, characters);
    // Init from list
    const count = $store.players.length;
    for (let i = 0; i < count; i++) {
      const player = $store.players[i];
      const character = {
        id: player?.author?.id,
        order: i + 1,
        name: player?.author?.name,
        shortName: player?.shortName,
        avatar: player?.avatar,
        platform: player?.platform?.name,
        type: player?.character?.type || getRandomNumber(1, 11)
      }
      addCharacterFromList(character, i, count);
    }
  }
}

function addCharacterFromList(data, i, n) {
  const L = 463; // diagonal line of start-line
  const D = 150; // init left of start-line
  const WH = 600; // wrapper height
  const CW = 105; // character width
  const CH = 105; // character height
  const c = ((i + 1) * L) / (n + 1);

  const a = c * 0.3741; // Math.abs(Math.sin(DA)); // DA must be convert from degree to radian
  const b = c * 0.927; // Math.abs(Math.sin(DB));

  const x = Math.floor(D + a - CW + 10);
  const y = Math.floor(WH - b - CH);

  data.startX = x;
  data.startY = y;
  data.endX = x;
  data.x = x;
  data.y = y;
  data.z = n - i;
  data.distance = 0;
  addCharacter(data);
}

function getCharacter(id) {
  return characters.find((character) => character.id == id);
}

function addCharacter(character) {
  if (!character.id || character.id == undefined) {
    character.id = genId();
  }
  characters.push(character);
}

function updateCharacter(data) {
  const length = characters.length;
  for (let i = 0; i < length; i++) {
    if (characters[i].id == data.id) {
      characters[i] = data;
      break;
    }
  }
}

function removeCharacter(id) {
  if (characters.length > 1) {
    characters.find((character) => character.id !== id);
  }
}

export {
  initCharacters,
  getCharacter,
  addCharacter,
  updateCharacter,
  removeCharacter
}
