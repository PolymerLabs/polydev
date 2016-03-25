/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var pagePorts = new Map();
var polymerPanelPorts = new Map();

// listen for polymer devtools panel, and element-zones content
// script connections
chrome.extension.onConnect.addListener(function(port) {
  if (port.name == 'polymer-panel') {

    port.onMessage.addListener(function(message, port) {
      if (!message.messageType) return;
      var messageType = message.messageType;
      if (messageType === 'tab-id') {
        // save the port to the polymer devtools panel
        polymerPanelPorts.set(message.tabId, port);

        chrome.webNavigation.onDOMContentLoaded.addListener(function(details) {
          var pagePort = pagePorts.get(details.tabId);

          if (pagePort && details.frameId === 0) {
            port.postMessage({
              messageType: 'tab-reloaded',
            });
          }
        });

        port.postMessage({
          messageType: 'handshake',
        });

      } else if (messageType === 'get-element-stats' ||
            messageType === 'clear-element-stats' ||
            messageType === 'filter-tags') {
        // relay to content script
        var tabId = message.tabId;
        var pagePort = pagePorts.get(tabId);
        pagePort.postMessage({
          messageType: messageType,
          detail: message.detail,
        });
      }
    });
  } else if (port.name =='element-zones') {
    console.log('element-zones.onConnect', port, port.sender.tab.id);
    // save the port to the element-zones content script
    pagePorts.set(port.sender.tab.id, port);
    port.onMessage.addListener(function(message, port) {
      if (message.messageType == 'element-stats' ||
          message.messageType == 'element-stats-clear') {
        console.log(message.messageType, message.data);
        // post to devtools panel
        var tabId = port.sender.tab.id;
        var polymerPanelPort = polymerPanelPorts.get(port.sender.tab.id);
        console.log('polymer panel port', tabId, polymerPanelPort);
        console.assert(polymerPanelPort != null);
        polymerPanelPort.postMessage({
          messageType: message.messageType,
          data: message.data,
        });
      }
    });

  }
});

// chrome.extension.onDisconnect.addListener(function(port) {
//   if (port.name == 'element-zones') {
//     console.log('element-zones.onDisconnect', port);
//     pagePorts.remove(port.sender.tab.id);
//   }
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('background chrome.runtime.onMessage', request, sender);
  if (request.messageType == 'get_times') {
    console.log('background get_times');
  }
});
