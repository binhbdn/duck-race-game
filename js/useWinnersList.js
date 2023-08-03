function show() {
  var winnersListDiv = document.querySelector('.winners-list');
  if (winnersListDiv) winnersListDiv.classList.add('show');
}
function hide() {
  var winnersListDiv = document.querySelector('.winners-list');
  if (winnersListDiv) winnersListDiv.classList.remove('show');
}
function toggle() {
  var winnersListDiv = document.querySelector('.winners-list');
  if (winnersListDiv) winnersListDiv.classList.toggle('show');
}

export default {
  show,
  hide,
  toggle,
}
