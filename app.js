const bookmarkBtnId = 'fe-bookmark-btn-id'
const subscribeBtnId = 'fe-subscribe-btn-id'

const activeBtnText = 'bookmark'
const inactiveBtnText = 'bookmarked'

const activeSubscribeBtnText = 'subscribe'
const loadBtnText = 'loading'
const inactiveSubscribeBtnText = 'subscribed'

function start_application() {
  const currentUrl = window.location.href;
  const subscribe_load_button = new Button_Factory(subscribeBtnId, loadBtnText, true, null)
  display_button_in_youtube(subscribe_load_button.get_btn())
  fetch_channel_url().then(function (channelURL) {
    id = get_youtube_video_id(currentUrl)
    if (channel_exists(channelURL)) {
      const inactive_subscribe_btn = new Button_Factory(subscribeBtnId, inactiveSubscribeBtnText, true, null)
      display_button_in_youtube(inactive_subscribe_btn.get_btn())
    } else {
      display_button_in_youtube(subscribe_button(channelURL))
    }
  })
  if (bookmark_exists(currentUrl)) {
    const inactive_bookmark_btn = new Button_Factory(bookmarkBtnId, inactiveBtnText, true, null)
    display_button_in_youtube(inactive_bookmark_btn.get_btn())
  } else {
    const active_bookmark_btn = new Button_Factory(bookmarkBtnId, activeBtnText, false, bookmark_current_url)
    display_button_in_youtube(active_bookmark_btn.get_btn())
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

function subscribe_button(channel_url) {
  element = document.getElementById(subscribeBtnId)
  if (typeof (element) !== 'undefined' && element !== null) {
    element.innerText = 'subscribe'
    element.disabled = false;
    element.onclick = subscribe_channel.bind(this, channel_url)
    return element;
  }
  // creating new button
  button = document.createElement('button');
  button.setAttribute("id", subscribeBtnId);
  button.innerText = 'subscribe';
  button.onclick = subscribe_channel.bind(this, channel_url)
  return button;
}

class Button_Factory {
  constructor(id, text, isDisabled, onClick) {
    this.id = id;
    this.text = text;
    this.onClick = onClick;
    this.isDisabled = isDisabled;
  }
  get_btn() {
    let element = document.getElementById(this.id)
    if (typeof (element) !== 'undefined' && element !== null) {
      element.innerText = this.text
      element.disabled = this.isDisabled;
      element.onclick = this.onClick
      return element;
    }
    let button = document.createElement('button');
    button.setAttribute("id", this.id);
    button.innerText = this.text;
    button.disabled = this.isDisabled;
    button.onclick = this.onClick;
    return button;
  }

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

function bookmark_current_url() {
  const currentUrl = window.location.href;
  if (!bookmark_exists(currentUrl)) {
    store_bookmark(currentUrl);
  }
  const inactive_bookmark_btn = new Button_Factory(bookmarkBtnId, inactiveBtnText, true, null)
  display_button_in_youtube(inactive_bookmark_btn.get_btn())
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
  const inactive_subscribe_btn = new Button_Factory(subscribeBtnId, inactiveSubscribeBtnText, true, null)
  display_button_in_youtube(inactive_subscribe_btn.get_btn())
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