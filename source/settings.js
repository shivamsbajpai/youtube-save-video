"use strict";

const bookmarksStr = 'bookmarks'
const bookmarkListId = "bookmark-list"

const channelsListId = "channel-list"

async function getData() {
  const bookmarkItem = await getItem(bookmarksStr)
  if (bookmarkItem) {
    const bookmarkObj = JSON.parse(bookmarkItem)
    const bookEle = document.getElementById(bookmarkListId)
    for (let i = 0; i < bookmarkObj?.length; i++) {
      let link = document.createElement('a')
      link.href = bookmarkObj[i]['url']

      let listEle = document.createElement('li')
      listEle.innerHTML = bookmarkObj[i]['title']

      let delButton = document.createElement('button')
      delButton.innerHTML = 'Remove Bookmark'
      delButton.setAttribute('class', 'delete-btn')
      delButton.onclick = async function () {
        const obj = removeElementFromArray(i, bookmarkObj)
        await setItem(bookmarksStr, JSON.stringify(obj))
        location.reload()
      }
      listEle.append(delButton)

      link.append(listEle)
      bookEle.append(link)
    }
  }

  const channelsItem = await getItem(channelsStr)
  if (channelsItem) {
    const channelObj = JSON.parse(channelsItem)
    const channelEle = document.getElementById(channelsListId)
    for (let i = 0; i < channelObj?.length; i++) {

      let link = document.createElement('a')
      link.href = channelObj[i]['channelURL']

      let listEle = document.createElement('li')
      listEle.innerHTML = channelObj[i]['channelTitle']

      let delButton = document.createElement('button')
      delButton.innerHTML = 'Remove Channel'
      delButton.setAttribute('class', 'delete-btn')
      delButton.onclick = async function () {
        const obj = removeElementFromArray(i, channelObj)
        await setItem(channelsStr, JSON.stringify(obj))
        location.reload()
      }
      listEle.append(delButton)

      link.append(listEle)
      channelEle.append(link)
    }
  }

}

async function exportData() {
  try {
    let stats = await browser.storage.local.get();
    let data = stats[extensionDataStorageKey]
    if (data) {
      const fileLink = createFile(JSON.stringify(data))
      const ele = document.createElement('a')
      ele.href = fileLink
      ele.download = 'export.json'
      ele.click()
      alert('exported successfully')
    } else {
      alert('data not available to export')
    }
  } catch (err) {
    console.log(err)
    alert('error while exporting data')
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
  const imBookmarksStr = obj[bookmarksStr]
  let imBookmarksArray = JSON.parse(imBookmarksStr)

  const imChannelsStr = obj[channelsStr]
  let imChannelsArray = JSON.parse(imChannelsStr)

  const existingData = await browser.storage.local.get();
  const extenDataVal = existingData[extensionDataStorageKey]
  if (extenDataVal) {
    let oldBookmarksStr = extenDataVal[bookmarksStr]
    let bookmarksArray = []
    if (oldBookmarksStr) {
      bookmarksArray = JSON.parse(oldBookmarksStr)
      bookmarksArray = bookmarksArray.concat(imBookmarksArray)
    }

    let oldChannelsStr = extenDataVal[channelsStr]
    let channelsArray = []
    if (oldChannelsStr) {
      channelsArray = JSON.parse(oldChannelsStr)
      channelsArray = channelsArray.concat(imChannelsArray)
    }

    bookmarksArray = dedupBookmarksArray(bookmarksArray);
    channelsArray = dedupChannelsArray(channelsArray);

    await browser.storage.local.clear()
    await setItem(bookmarksStr, JSON.stringify(bookmarksArray))
    await setItem(channelsStr, JSON.stringify(channelsArray))
  } else {
    imBookmarksArray = dedupBookmarksArray(imBookmarksArray);
    imChannelsArray = dedupChannelsArray(imChannelsArray);
    await setItem(bookmarksStr, JSON.stringify(imBookmarksArray))
    await setItem(channelsStr, JSON.stringify(imChannelsArray))
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

