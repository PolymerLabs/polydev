<!--
@license
Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
-->

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
