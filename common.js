function getItem(key) {
  return window.localStorage.getItem(key)
}

function setItem(key, val) {
  localStorage.setItem(key, val);
}

function getExistingChannelsObj() {
  let bookmarkStr = getItem('channels');
  return bookmarkStr ? JSON.parse(bookmarkStr) : [];
}