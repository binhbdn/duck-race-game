export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/*
export function zeroPad(str, numberZero) {
  return String(str).padStart(numberZero, "0");
}
*/

export function getTimer(timer) {
  timer = timer.split(":");
  timer = parseInt(timer[0]) * 3600 + parseInt(timer[1]) * 60 + parseInt(timer[2]);
  timer *= 1000;
  return timer;
}

export function getUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // FIXME: delete following code (code for testing only)
  if (!queryString) {
    queryString = 'room=64b655907b294e10e869fc40-binhbdn-stream-mix&lang=en&keyword=like&goalType=timer&commentsNum=20&timer=00%3A00%3A25&showCommentsNum=true&winnersCount=3';
    console.log('queryString for testing only (must delete this code before deploy):', queryString);
  }

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string') {
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}

export function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';

  return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}


export function getShortStr(str, maxLen = 50) {
  const length = (new TextEncoder().encode(str)).length;
  if (length <= maxLen) return str;
  const strArr = str.split(" ");
  let newStr = `${strArr[0]} ${strArr[strArr.length - 1]}`;

  if (newStr > maxLen) {
    if (length > 2) {
      return getShortStr(newStr, maxLen);
    } else {
      return `...${strArr[strArr.length - 1]}`;
    }
  }
  return `${strArr[0]}...${strArr[strArr.length - 1]}`;
}