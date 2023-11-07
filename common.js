function get_existing_channels_obj() {
  let bookmarkStr = window.localStorage.getItem('channels');
  return bookmarkStr ? JSON.parse(bookmarkStr) : [];
}