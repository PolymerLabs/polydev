console.log("devtools.html loaded!!!");

chrome.devtools.panels.create("Polymer",
  "icon.png",
  "src/polymer.html",
  function(panel) {
    console.log("after polymer.html loaded!!!");
  }
);

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page"
});

// console.log('backgroundPageConnection');
// console.dir(backgroundPageConnection);

backgroundPageConnection.onMessage.addListener(function (message, sender) {
  // Handle responses from the background page, if any
  console.log(message, sender);
});

console.log('sending a message now!!!', chrome.devtools.inspectedWindow.tabId);
// Relay the tab ID to the background page
chrome.runtime.sendMessage('kcoiaofoedgogmnganogddeagelgkcgh', {
  messageType: 'tab_inspected',
  tabId: chrome.devtools.inspectedWindow.tabId,
});
