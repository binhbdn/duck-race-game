import { formatDateTime, getShortStr } from './useHelper.js'
import $store from './useStore.js';
import useImage from "./useImage.js";

const INIT_ROWS_COUNT = 7;
const maxPlayers = $store.maxPlayers || Infinity;

const waitingListDiv = document.querySelector('.waiting-list');
const tableWrapper = document.getElementById("table-wrapper");
const tableBody = tableWrapper.querySelector(".table-waiting-list tbody");
const rows = tableBody.querySelectorAll("tr");
const playersCountElm = document.getElementById("total-waiting-ducks");

// Automatically scroll to the bottom
function autoScrollTableToBottom() {
  tableWrapper.scrollTop = tableWrapper.scrollHeight;
}

function updateViewPlayersCount() {
  playersCountElm.textContent = $store.playersCount.toString();
}

async function saveCommentToStore(comment) {
  const avatar = await useImage(comment?.author?.avatar, {
    width: 35,
    height: 35,
    rounded: true,
    cache: true,
    mimetype: 'png'
  });
  comment.avatar = avatar;
  comment.shortName = getShortStr(comment?.author?.name, 20);
  $store.players.push(comment);
  console.log('$store.players', comment);
}

function show() {
  if (!waitingListDiv) return;
  waitingListDiv.classList.remove('hidden');
}

function hide() {
  if (!waitingListDiv) return;
  waitingListDiv.classList.add('hidden');
}

function toggle() {
  if (!waitingListDiv) return;
  waitingListDiv.classList.toggle('hidden');
}

async function addPlayers(comments) {
  if (!rows || !Array.isArray(comments)) return;

  comments.forEach(async (comment) => {
    // If $store.playersCount === $store.maxPlayers, exit the function :
    if ($store.playersCount === maxPlayers) return;

    // Else $store.playersCount < maxPlayers :
    $store.playersCount++;
    updateViewPlayersCount();
    await saveCommentToStore(comment);

    if ($store.playersCount <= INIT_ROWS_COUNT) {
      const rowToUpdate = rows[$store.playersCount - 1];
      const cells = rowToUpdate.querySelectorAll("td");
      cells[0].textContent = $store.playersCount;
      cells[2].textContent = formatDateTime(comment.timestamp);

      // Create an image element for the avatar
      const avatarImg = document.createElement("img");
      avatarImg.src = comment.author.avatar;
      avatarImg.alt = comment.author.name;
      avatarImg.classList.add("avatar");

      // Create a span element for the user name
      const userNameSpan = document.createElement("span");
      userNameSpan.textContent = comment.author.name;

      // Clear existing content in the second cell and append the avatar and user name elements
      cells[1].innerHTML = '';
      cells[1].appendChild(avatarImg);
      cells[1].appendChild(userNameSpan);
    } else {
      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${$store.playersCount}</td>
        <td></td>
        <td>${formatDateTime(comment.timestamp)}</td>
      `;

      // Create an image element for the avatar
      const avatarImg = document.createElement("img");
      avatarImg.src = comment.author.avatar;
      avatarImg.alt = comment.author.name;
      avatarImg.classList.add("avatar");

      // Create a span element for the user name
      const userNameSpan = document.createElement("span");
      userNameSpan.textContent = comment.author.name;

      // Insert the avatar and user name elements into the second cell of the new row
      newRow.querySelector("td:nth-child(2)").appendChild(avatarImg);
      newRow.querySelector("td:nth-child(2)").appendChild(userNameSpan);

      tableBody.appendChild(newRow);
      autoScrollTableToBottom();
    }
  });
}

export default {
  show,
  hide,
  toggle,
  addPlayers,
};
