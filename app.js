const bookmarkBtnId = 'fe-bookmark-btn-id'

const subscribeBtnId = 'fe-subscribe-btn-id'

const activeBtnText = 'Save'
const inactiveBtnText = 'Saved'

const activeSubscribeBtnText = 'Subscribe'
const loadBtnText = 'Loading'
const inactiveSubscribeBtnText = 'Subscribed'

function start_application() {
  const currentUrl = window.location.href;
  ele = document.getElementById(subscribeBtnId)
  if (ele === null) {
    const subscribe_load_button = new Button_Factory(subscribeBtnId, loadBtnText, true, null)
    display_button_in_youtube(subscribe_load_button.get_btn())
  } else {
    ele.innerText = loadBtnText
    ele.disabled = true;
  }
  fetch_channel_url().then(function (channelURL) {
    if (channelURL !== "") {
      if (channel_exists(channelURL)) {
        ele = document.getElementById(subscribeBtnId)
        ele.innerText = inactiveSubscribeBtnText
        ele.disabled = true;
      } else {
        ele = document.getElementById(subscribeBtnId)
        ele.innerText = activeSubscribeBtnText
        ele.onclick = function () {
          subscribe_channel(channelURL)
        };
        ele.disabled = false
      }
    } else {
      ele = document.getElementById(subscribeBtnId)
      ele.innerText = 'Unavailable'
      ele.disabled = true;
    }
  })
  if (bookmark_exists(currentUrl)) {
    ele = document.getElementById(bookmarkBtnId)
    if (ele === null) {
      const inactive_bookmark_btn = new Button_Factory(bookmarkBtnId, inactiveBtnText, true, null)
      display_button_in_youtube(inactive_bookmark_btn.get_btn())
    } else {
      ele.innerText = inactiveBtnText
      ele.disabled = true;
    }
  } else {
    ele = document.getElementById(bookmarkBtnId)
    if (ele === null) {
      const active_bookmark_btn = new Button_Factory(bookmarkBtnId, activeBtnText, false, bookmark_current_url)
      display_button_in_youtube(active_bookmark_btn.get_btn())
    } else {
      ele.innerText = activeBtnText
      ele.onclick = bookmark_current_url
      ele.disabled = false
    }
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

class Button_Factory {
  constructor(id, text, isDisabled, onClick, onClickBindParams) {
    this.id = id;
    this.text = text;
    this.onClick = onClick;
    this.isDisabled = isDisabled;
    this.onClickBindParams = onClickBindParams;
    this.css_class = 'btn'
  }
  get_btn() {
    let element = document.getElementById(this.id)
    if (typeof (element) !== 'undefined' && element !== null) {
      element.innerText = this.text
      element.disabled = this.isDisabled;
      if (this.onClick != null && this.onClickBindParams?.length) {
        element.onclick = this.onClick.bind(this.onClick, ...this.onClickBindParams);
      } else {
        element.onclick = this.onClick
      }
      element.className = this.css_class
      return element;
    }
    let button = document.createElement('button');
    button.setAttribute("id", this.id);
    button.innerText = this.text;
    button.disabled = this.isDisabled;
    if (this.onClick != null && this.onClickBindParams?.length) {
      button.onclick = this.onClick.bind(this.onClick, ...this.onClickBindParams);
    } else {
      button.onclick = this.onClick
    }
    button.className = this.css_class
    return button;
  }

}

async function getChannelIDfromYouTubeAPI(video_id) {
  url = `https://yt.lemnoslife.com/noKey/videos?part=snippet&id=${video_id}`
  const response = await fetch(url);
  const respJson = await response.json();
  return respJson["items"]?.length > 0 ? respJson["items"][0]["snippet"]["channelId"] : ""
}

const fetch_channel_url = async function () {
  let channelId = await getChannelIDfromYouTubeAPI(get_youtube_video_id(window.location.href))
  return channelId !== "" ? `https://youtube.com/channel/${channelId}` : ""
}

function bookmark_current_url() {
  const currentUrl = window.location.href;
  if (!bookmark_exists(currentUrl)) {
    store_bookmark(currentUrl);
  }
  ele = document.getElementById(bookmarkBtnId)
  ele.innerText = inactiveBtnText
  ele.disabled = true;
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
  ele = document.getElementById(subscribeBtnId)
  ele.innerText = inactiveSubscribeBtnText
  ele.disabled = true;
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
  return bookmarkStr ? JSON.parse(bookmarkStr) : [];
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


function start_application() {
  const currentUrl = window.location.href;
  ele = document.getElementById(subscribeBtnId)
  if (ele === null) {
    const subscribe_load_button = new Button_Factory(subscribeBtnId, loadBtnText, true, null)
    display_button_in_youtube(subscribe_load_button.get_btn())
  } else {
    ele.innerText = loadBtnText
    ele.disabled = true;
  }
  fetch_channel_url().then(function (channelURL) {
    if (channelURL !== "") {
      if (channel_exists(channelURL)) {
        ele = document.getElementById(subscribeBtnId)
        ele.innerText = inactiveSubscribeBtnText
        ele.disabled = true;
      } else {
        ele = document.getElementById(subscribeBtnId)
        ele.innerText = activeSubscribeBtnText
        ele.onclick = function () {
          subscribe_channel(channelURL)
        };
        ele.disabled = false
      }
    } else {
      ele = document.getElementById(subscribeBtnId)
      ele.innerText = 'Unavailable'
      ele.disabled = true;
    }

  })
  if (bookmark_exists(currentUrl)) {
    ele = document.getElementById(bookmarkBtnId)
    if (ele === null) {
      const inactive_bookmark_btn = new Button_Factory(bookmarkBtnId, inactiveBtnText, true, null)
      display_button_in_youtube(inactive_bookmark_btn.get_btn())
    } else {
      ele.innerText = inactiveBtnText
      ele.disabled = true;
    }
  } else {
    ele = document.getElementById(bookmarkBtnId)
    if (ele === null) {
      const active_bookmark_btn = new Button_Factory(bookmarkBtnId, activeBtnText, false, bookmark_current_url)
      display_button_in_youtube(active_bookmark_btn.get_btn())
    } else {
      ele.innerText = activeBtnText
      ele.onclick = bookmark_current_url
      ele.disabled = false
    }
  }
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