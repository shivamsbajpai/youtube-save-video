async function getItem(key) {
  let stats = await browser.storage.local.get();
  let data = stats["ext"]
  if (data) {
    return data[key]
  }
  return null
}

async function getData() {
  const bookmarkStr = await getItem('bookmarks')
  if (bookmarkStr) {
    const bookmarkObj = JSON.parse(bookmarkStr)
    const bookEle = document.getElementById("bookmark-list")
    for (let i = 0; i < bookmarkObj?.length; i++) {
      let link = document.createElement('a')
      link.href = bookmarkObj[i]['url']

      let listEle = document.createElement('li')
      listEle.innerHTML = bookmarkObj[i]['title']

      link.append(listEle)
      bookEle.append(link)
    }
  }


  const channelsStr = await getItem('channels')
  if (channelsStr) {
    const channelObj = JSON.parse(channelsStr)
    const channelEle = document.getElementById("channel-list")
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

getData()
