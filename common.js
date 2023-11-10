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