const bookmarkBtnId = 'fe-bookmark-btn-id'

const subscribeBtnId = 'fe-subscribe-btn-id'

const activeBtnText = 'Save'
const inactiveBtnText = 'Saved'

const activeSubscribeBtnText = 'Subscribe'
const loadBtnText = 'Loading'
const inactiveSubscribeBtnText = 'Subscribed'


function getYouTubeVideoId(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  var match = url.match(regExp);
  return (match && match[7].length == 11) ? match[7] : false;
}

function displayButtonInYouTube(button) {
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
  getBtn() {
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

async function getChannelInfoFromAPI(video_id) {
  url = `https://yt.lemnoslife.com/noKey/videos?part=snippet&id=${video_id}`
  const response = await fetch(url);
  const respJson = await response.json();
  return new Promise(function(resolve, reject){
    if(respJson["items"]?.length > 0) {
      resolve({
        "channelId": respJson["items"][0]["snippet"]["channelId"],
        "channelTitle": respJson["items"][0]["snippet"]["channelTitle"],
        "channelURL": `https://youtube.com/channel/${respJson["items"][0]["snippet"]["channelId"]}`
      })
    } else {
      const err = new Error("could not fetch data")
      reject(err)
    }
  })
}

const fetchChannelUrl = async function () {
  return await getChannelInfoFromAPI(getYouTubeVideoId(window.location.href))
}

async function bookmarkCurrentUrl() {
  const currentUrl = window.location.href;
  const videoId = getYouTubeVideoId(currentUrl)
  const check = await bookmarkExists(currentUrl)
  if (!check) {
    storeBookmark(videoId, currentUrl);
  }
  ele = document.getElementById(bookmarkBtnId)
  ele.innerText = inactiveBtnText
  ele.disabled = true;
}

async function storeBookmark(video_id, new_bookmark) {
  const bookmarks = await getExistingBookmarksObj()
  const baseUrl = 'https://yt.lemnoslife.com/noKey/videos?part=snippet&id=';
  const url = baseUrl + video_id
  const response = await fetch(url)
  const respJson = await response.json()
  const title = respJson['items'][0]['snippet']['title']
  bookmarks.push({
    "videoId": video_id,
    "url": new_bookmark,
    "title": title
  });
  setItem('bookmarks', JSON.stringify(bookmarks));
}

async function subscribeChannel(channelInfo) {
  const check = await channelExists(channelInfo)
  if (!check) {
    store_channel(channelInfo)
  }
  ele = document.getElementById(subscribeBtnId)
  ele.innerText = inactiveSubscribeBtnText
  ele.disabled = true;
}

async function store_channel(channel_url) {
  let channels = await getExistingChannelsObj()
  channels.push(channel_url);
  setItem('channels', JSON.stringify(channels))
  return true;
}

async function getExistingBookmarksObj() {
  let bookmarkStr = await getItem('bookmarks')
  if (bookmarkStr) {
    return JSON.parse(bookmarkStr)
  }
  return [];
}

async function bookmarkExists(new_bookmark) {
  let bookmarks = await getExistingBookmarksObj()
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i]["url"] === new_bookmark) {
      return true;
    }
  }
  return false;
}

async function channelExists(info) {
  let channels = await getExistingChannelsObj()
  for (let i = 0; i < channels.length; i++) {
    if (channels[i]['channelURL'] === info['channelURL']) {
      return true;
    }
  }
  return false;
}


async function startApplication() {
  const currentUrl = window.location.href;
  ele = document.getElementById(subscribeBtnId)
  if (ele === null) {
    const subscribe_load_button = new Button_Factory(subscribeBtnId, loadBtnText, true, null)
    displayButtonInYouTube(subscribe_load_button.getBtn())
  } else {
    ele.innerText = loadBtnText
    ele.disabled = true;
  }
  try {
    const channelInfo = await fetchChannelUrl()
    const check = await channelExists(channelInfo)
    if (check) {
      ele = document.getElementById(subscribeBtnId)
      ele.innerText = inactiveSubscribeBtnText
      ele.disabled = true;
    } else {
      ele = document.getElementById(subscribeBtnId)
      ele.innerText = activeSubscribeBtnText
      ele.onclick = function () {
        subscribeChannel(channelInfo)
      };
      ele.disabled = false
    }
  } catch(err) {
    ele = document.getElementById(subscribeBtnId)
    ele.innerText = 'Unavailable'
    ele.disabled = true;
  }

  const check = await bookmarkExists(currentUrl)
  if (check) {
    ele = document.getElementById(bookmarkBtnId)
    if (ele === null) {
      const inactive_bookmark_btn = new Button_Factory(bookmarkBtnId, inactiveBtnText, true, null)
      displayButtonInYouTube(inactive_bookmark_btn.getBtn())
    } else {
      ele.innerText = inactiveBtnText
      ele.disabled = true;
    }
  } else {
    ele = document.getElementById(bookmarkBtnId)
    if (ele === null) {
      const active_bookmark_btn = new Button_Factory(bookmarkBtnId, activeBtnText, false, bookmarkCurrentUrl)
      displayButtonInYouTube(active_bookmark_btn.getBtn())
    } else {
      ele.innerText = activeBtnText
      ele.onclick = bookmarkCurrentUrl
      ele.disabled = false
    }
  }
}


let previousUrl = '';
let observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    startApplication()
  }
});

const config = { attributes: true, childList: true, subtree: true };
observer.observe(document, config);