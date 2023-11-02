function start_application() {
  const currentUrl = window.location.href;
  display_button_in_youtube(subscribe_load_button());
  fetch_channel_url().then(function (channelURL) {
    id = get_youtube_video_id(currentUrl)
    if (channel_exists(channelURL)) {
      display_button_in_youtube(subscribe_inactive_btn())
    } else {
      display_button_in_youtube(subscribe_button(channelURL))
    }
  })
  if (bookmark_exists(currentUrl)) {
    display_button_in_youtube(inactive_button())
  } else {
    display_button_in_youtube(active_button())
  }
}


function get_youtube_video_id(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

function display_button_in_youtube(button) {
  info_div = document.getElementById('end');
  info_div.appendChild(button);
}

function active_button() {
  element = document.getElementById('fe-bookmark-btn-id')
  if (typeof (element) !== 'undefined' && element !== null) {
    element.innerText = 'bookmark'
    element.disabled = false;
    element.onclick = bookmark_current_url
    return element;
  }
  // creating new button
  button = document.createElement('button');
  button.setAttribute("id", "fe-bookmark-btn-id");
  button.innerText = 'bookmark';
  button.onclick = bookmark_current_url
  return button;
}

function subscribe_button(channel_url) {
  id = 'fe-subscribe-btn-id'
  element = document.getElementById(id)
  if (typeof (element) !== 'undefined' && element !== null) {
    element.innerText = 'subscribe'
    element.disabled = false;
    element.onclick = subscribe_channel.bind(this, channel_url)
    return element;
  }
  // creating new button
  button = document.createElement('button');
  button.setAttribute("id", id);
  button.innerText = 'subscribe';
  button.onclick = subscribe_channel.bind(this, channel_url)
  return button;
}


function subscribe_load_button() {
  id = 'fe-subscribe-btn-id'
  element = document.getElementById(id)
  if (typeof (element) !== 'undefined' && element !== null) {
    element.innerText = 'loading'
    element.disabled = true;
    return element;
  }
  // creating new button
  button = document.createElement('button');
  button.setAttribute("id", id);
  button.innerText = 'loading';
  button.disabled = true;
  return button;
}

function subscribe_inactive_btn() {
  id = 'fe-subscribe-btn-id'
  element = document.getElementById(id)
  if (typeof (element) !== 'undefined' && element !== null) {
    element.innerText = 'subscribed'
    element.disabled = true;
    return element;
  }
  // creating new button
  button = document.createElement('button');
  button.setAttribute("id", id);
  button.innerText = 'subscribed';
  button.disabled = true;
  return button;
}

async function callYoutubeAPI(video_id) {
  url = `https://yt.lemnoslife.com/noKey/videos?part=snippet&id=${video_id}`
  const response = await fetch(url);
  const respJson = await response.json();
  return respJson["items"][0]["snippet"]["channelId"]
}

const fetch_channel_url = async function () {
  let channelId = await callYoutubeAPI(get_youtube_video_id(window.location.href))
  let channelUrl = `https://youtube.com/channel/${channelId}`
  return channelUrl
}

function inactive_button() {
  element = document.getElementById('fe-bookmark-btn-id')
  if (typeof (element) !== 'undefined' && element !== null) {
    element.innerText = 'bookmarked'
    element.disabled = true;
    return element;
  }
  button = document.createElement('button');
  button.setAttribute("id", "fe-bookmark-btn-id");
  button.innerText = 'bookmarked';
  button.disabled = true;
  return button;
}

function bookmark_current_url() {
  const currentUrl = window.location.href;
  if (!bookmark_exists(currentUrl)) {
    store_bookmark(currentUrl);
  }
  display_button_in_youtube(inactive_button())
}

function store_bookmark(new_bookmark) {
  bookmarks = get_existing_bookmarks_obj()
  bookmarks.push(new_bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  return true;
}

function subscribe_channel(channel_url) {
  if (!channel_exists(channel_url)) {
    store_channel(channel_url)
  }
  display_button_in_youtube(subscribe_inactive_btn())
}

function store_channel(channel_url) {
  bookmarks = get_existing_channels_obj()
  bookmarks.push(channel_url);
  localStorage.setItem('channels', JSON.stringify(bookmarks));
  return true;
}

function get_existing_bookmarks_obj() {
  let bookmarkStr = window.localStorage.getItem('bookmarks');
  if (bookmarkStr) {
    return JSON.parse(bookmarkStr)
  }
  return [];
}

function get_existing_channels_obj() {
  let bookmarkStr = window.localStorage.getItem('channels');
  if (bookmarkStr) {
    return JSON.parse(bookmarkStr)
  }
  return [];
}

function bookmark_exists(new_bookmark) {
  bookmarks = get_existing_bookmarks_obj()
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i] === new_bookmark) {
      return true;
    }
  }
  return false;
}

function channel_exists(channel_url) {
  bookmarks = get_existing_channels_obj()
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i] === channel_url) {
      return true;
    }
  }
  return false;
}


let previousUrl = '';
let observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    start_application()
  }
});

const config = { attributes: true, childList: true, subtree: true };
observer.observe(document, config);