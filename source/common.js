async function getItem(key) {
  let stats = await browser.storage.local.get();
  let data = stats["ext"]
  if(data) {
    return data[key]
  }
  return null 
}

async function setItem(key, val) {
  let data = await browser.storage.local.get();
  if(Object.keys(data).length === 0) {
    data = {
      "ext": {}
    }
  }
  data["ext"][key] = val
  browser.storage.local.set(data, function () {
  });
}

async function getExistingChannelsObj() {
  let bookmarkStr = await getItem('channels');
  return bookmarkStr ? JSON.parse(bookmarkStr) : [];
}

function dedupBookmarksArray(bookmarksArray) {
  let fixMap = {};
  for(let i = 0;i<bookmarksArray.length; i++) {
    fixMap[bookmarksArray[i]["videoId"]] = bookmarksArray[i];
  }
  let tempArray = [];
  for(let key in fixMap) {
    tempArray.push(fixMap[key]);
  }
  return tempArray;
}

function dedupChannelsArray(channelsArray) {
  let fixMap = {};
  for(let i = 0;i<channelsArray.length; i++) {
    fixMap[channelsArray[i]["channelId"]] = channelsArray[i];
  }
  let tempArray = [];
  for(let key in fixMap) {
    tempArray.push(fixMap[key]);
  }
  return tempArray;
}

function removeElementFromArray(index, array) {
  array[index] = array[array.length -1];
  array.pop();
  return array
}
