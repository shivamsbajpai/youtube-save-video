function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function firefoxBrowserAction() {
  browser.browserAction.onClicked.addListener(() => {
    let creating = browser.tabs.create({
      url: "./settings.html",
    });
    creating.then(onCreated, onError);
  });
}

function chromeBrowserAction() {
  chrome.browserAction.onClicked.addListener(
    () => {
      chrome.tabs.create({
        url: "./settings.html",
      });
    }
  );
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