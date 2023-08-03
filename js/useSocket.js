import { URL_SOCKET_SERVER } from './config.js'
import { getUrlParams } from './useHelper.js';

const urlParams = getUrlParams()
const roomId = urlParams?.room || "64b655907b294e10e869fc40-binhbdn-stream-mix";
if (!roomId) {
  console.error('Error: roomId is required. Please correct "room" query of your URL and try again.');
} else {
  console.log('Get URL params success!', urlParams);
}

let ignore = true;

// Function to initialize the socket connection
function init(handleNewComments) {
  const socket = io(URL_SOCKET_SERVER);

  socket.on('connect', () => {
    socket.removeAllListeners();
    socket.emit('call', 'live.subscribe', { id: roomId }, function (err, res) {
      if (err) {
        console.error('Error connect socket:', err);
      } else {
        console.log('Socket connect success!', res);
      }
    });

    socket.on('comment', comments => {
      // ignore first received comments
      // bỏ qua những bình luận nhận được đầu tiên
      if (ignore) {
        ignore = false;
        return
      }

      if (!comments || comments?.length === 0) {
        console.log('Socket receive empty comments data!');
        return;
      }

      console.log('Socket receive new comments:', comments);
      handleNewComments(comments);
    });
  });
}

// Function to close the socket connection
function close() {
  if (socket) {
    socket.close();
  }
}

export default {
  init,
  close
}
