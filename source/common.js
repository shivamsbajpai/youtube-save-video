const channelsStr = 'channels'

async function getItem(key) {
  let browser = getBrowser();
  switch (browser) {
    case "firefox":
      return getItemFromFirefox(key);
    case "chrome":
      return getItemFromChrome(key);
  }
}

async function getItemFromFirefox(key) {
  let data = await browser.storage.local.get(key);
  if (data) {
    return data[key]
  }
  return null
}

async function getItemFromChrome(key) {
  const dt = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get([key], function (result) {
        resolve(result);
      });
    })
  }
  let data = await dt();
  if (data) {
    return data[key]
  }
  return null
}

async function setItem(key, val) {
  let browser = getBrowser();
  switch (browser) {
    case "firefox":
      return setItemInFirefox(key, val);
    case "chrome":
      return setItemInChrome(key, val);
  }
}

async function setItemInFirefox(key, val) {
  let data = await browser.storage.local.get();
  if (Object.keys(data).length === 0) {
    data = {};
  }
  data[key] = val
  browser.storage.local.set(data, function () {
  });
}

async function setItemInChrome(key, val) {
  await chrome.storage.local.set({[key]: val}, function () {
  });
}

async function getExistingChannelsObj() {
  let channels = await getItem(channelsStr);
  return channels ? JSON.parse(channels) : [];
}

function dedupBookmarksArray(bookmarksArray) {
  let fixMap = {};
  for (let i = 0; i < bookmarksArray.length; i++) {
    fixMap[bookmarksArray[i]["videoId"]] = bookmarksArray[i];
  }
  let tempArray = [];
  for (let key in fixMap) {
    tempArray.push(fixMap[key]);
  }
  return tempArray;
}

function dedupChannelsArray(channelsArray) {
  let fixMap = {};
  for (let i = 0; i < channelsArray.length; i++) {
    fixMap[channelsArray[i]["channelId"]] = channelsArray[i];
  }
  let tempArray = [];
  for (let key in fixMap) {
    tempArray.push(fixMap[key]);
  }
  return tempArray;
}

function removeElementFromArray(index, array) {
  array[index] = array[array.length - 1];
  array.pop();
  return array
}

function getBrowser() {
  let agent = navigator.userAgent
  if (agent.toLowerCase().includes('firefox')) {
    return 'firefox';
  } else if (agent.toLowerCase().includes('chrome')) {
    return 'chrome';
  }
  return 'not supported';
}

async function clearFirefoxStorage() {
  await browser.storage.local.clear();
}

async function clearChromeStorage() {
  await chrome.storage.local.clear();
}

async function clearBrowserStorage() {
  let browser = getBrowser();
  switch (browser) {
    case "firefox":
      return clearFirefoxStorage();
    case "chrome":
      return clearChromeStorage();
  }
}