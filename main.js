/*
  for testing:
  ?room=64b655907b294e10e869fc40-binhbdn-stream-mix&lang=en&keyword=like&goalType=timer&commentsNum=20&timer=00%3A00%3A25&showCommentsNum=true&winnersCount=3
*/

import $store from './js/useStore.js';
import useTimer from './js/useTimer.js'

import $socket from './js/useSocket.js';
import $waitingList from './js/useWaitingList.js';
import $winnerList from './js/useWinnersList.js';
import $game from './js/useGame.js';


// TODO: get game options from socket and then update $game.options
// For testing purposes:
$store.options.numberCharacters = 5;
$store.options.timer = "00:00:20";

const $timer = useTimer($store.options.timer);

async function onGetNewComments(comments) {
  await $waitingList.addPlayers(comments)
}

function initApp() {
  $game.init();
  $socket.init(onGetNewComments);
  $timer.initView();
  // $waitingList.hide();
}

// Initialize the app when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// Clean up and close socket, clear timer when the page is about to unload
window.addEventListener('beforeunload', () => {
  $socket.close();
  $timer.clear();
});

async function prepare() {
  $waitingList.hide();
  await $game.prepare();
}

function start() {
  $timer.start();
  $game.start();
}

function reset() {
  $timer.reset();
  $winnerList.hide();
  $waitingList.show();
}

function onToggleWaitingList() {
  $winnerList.hide();
  $waitingList.toggle();
}

function onToggleWinnerList() {
  $waitingList.hide();
  $winnerList.toggle();
}

// for directly using in index.html
window.$app = {
  prepare,
  start,
  reset,
  onToggleWaitingList,
  onToggleWinnerList,
}
