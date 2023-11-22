function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function firefoxBrowserAction() {
  browser.action.onClicked.addListener(() => {
    let creating = browser.tabs.create({
      url: "./settings.html",
    });
    creating.then(onCreated, onError);
  });
}

function chromeBrowserAction() {
  chrome.action.onClicked.addListener(
    () => {
      chrome.tabs.create({
        url: "./settings.html",
      });
    }
  );
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


function addBrowserAction() {
  let browser = getBrowser();
  switch (browser) {
    case "firefox":
      return firefoxBrowserAction();
    case "chrome":
      return chromeBrowserAction();
  }
}

addBrowserAction();