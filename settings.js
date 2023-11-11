async function getItem(key) {
  let stats = await browser.storage.local.get();
  let data = stats["ext"]
  if (data) {
    return data[key]
  }
  return null
}

async function setItem(key, val) {
  let data = await browser.storage.local.get();
  if (Object.keys(data).length === 0) {
    data = {
      "ext": {}
    }
  }
  data["ext"][key] = val
  browser.storage.local.set(data, function () {
  });
}


const bookmarks = 'bookmarks'
const bookmarkListId = "bookmark-list"

const channels = 'channels'
const channelsListId = "channel-list"

async function getData() {
  const bookmarkStr = await getItem(bookmarks)
  if (bookmarkStr) {
    const bookmarkObj = JSON.parse(bookmarkStr)
    const bookEle = document.getElementById(bookmarkListId)
    for (let i = 0; i < bookmarkObj?.length; i++) {
      let link = document.createElement('a')
      link.href = bookmarkObj[i]['url']

      let listEle = document.createElement('li')
      listEle.innerHTML = bookmarkObj[i]['title']

      link.append(listEle)
      bookEle.append(link)
    }
  }

  const channelsStr = await getItem(channels)
  if (channelsStr) {
    const channelObj = JSON.parse(channelsStr)
    const channelEle = document.getElementById(channelsListId)
    for (let i = 0; i < channelObj?.length; i++) {

      let link = document.createElement('a')
      link.href = channelObj[i]['channelURL']

      let listEle = document.createElement('li')
      listEle.innerHTML = channelObj[i]['channelTitle']

      link.append(listEle)
      channelEle.append(link)
    }
  }

}

async function exportData() {
  try {
    let stats = await browser.storage.local.get();
    let data = stats["ext"]
    if (data) {
      const fileLink = createFile(JSON.stringify(data))
      const ele = document.createElement('a')
      ele.href = fileLink
      ele.download = 'export.json'
      ele.click()
    }
  } catch (err) {
    console.log(err)
  }
  return null
}

function createFile(text) {
  const data = new Blob([text], { type: 'application/json' });
  return window.URL.createObjectURL(data);
}

function loadFile() {
  const input = document.getElementById('file-input');
  input.type = 'file'
  input.onchange = function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = function (event) {
      const content = event.target.result;
      importData(content)
    }
  }
}

async function importData(data) {
  const obj = JSON.parse(data)
  const imBookmarksStr = obj['bookmarks']
  const imBookmarksArray = JSON.parse(imBookmarksStr)

  const imChannelsStr = obj['channels']
  const imChannelsArray = JSON.parse(imChannelsStr)

  const existingData = await browser.storage.local.get();
  const extenDataVal = existingData["ext"]
  if (extenDataVal) {
    let oldBookmarksStr = extenDataVal['bookmarks']
    let bookmarksArray = []
    if (oldBookmarksStr) {
      bookmarksArray = JSON.parse(oldBookmarksStr)
      bookmarksArray = bookmarksArray.concat(imBookmarksArray)
    }

    let oldChannelsStr = extenDataVal['channels']
    let channelsArray = []
    if (oldChannelsStr) {
      channelsArray = JSON.parse(oldChannelsStr)
      channelsArray = channelsArray.concat(imChannelsArray)
    }

    await browser.storage.local.clear()
    await setItem('bookmarks', JSON.stringify(bookmarksArray))
    await setItem('channels', JSON.stringify(channelsArray))
  } else {
    await setItem('bookmarks', JSON.stringify(imBookmarksArray))
    await setItem('channels', JSON.stringify(imChannelsArray))
  }
  location.reload()
}

function startApplication() {
  getData()
  const ele = document.getElementById('export-btn')
  ele.onclick = exportData
  loadFile()
}

startApplication()

