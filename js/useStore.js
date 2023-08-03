const useStore = {
  maxPlayers: 200,
  // players: raw data get from socket listener
  players: [],
  playersCount: 0,

  // characters: parsed date mapped form players
  characters: [],

  // options = game options + game controlling options
  options: {
    ele: 'canvas',
    mode: 'random',
    numberCharacters: 5,
    timer: '00:00:30',
    status: 'init',
    isShowWinner: false,
    MAX_PERCENT_X: 0.6,
    DELAY_TIME: 2000,
    PREPARE_WIN_TIME: 5000,
    isShowNameBox: true,
  },
};

export default useStore;