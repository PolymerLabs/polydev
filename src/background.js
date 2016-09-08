/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const pagePorts = new Map();
const polymerPanelPorts = new Map();

// listen for polymer devtools panel, and element-zones content
// script connections
chrome.extension.onConnect.addListener((port) => {
  if (port.name == 'polymer-panel') {
    console.log('polymer-panel connected', port);

    port.onMessage.addListener((message, port) => {
      console.log('from polymer-panel', message, port);
      if (!message.messageType) {
        return;
      }
      const messageType = message.messageType;
      if (messageType === 'tab-id') {
        console.log('polymer-page tab-id', message.tabId);
        // save the port to the polymer devtools panel
        polymerPanelPorts.set(message.tabId, port);

        port.postMessage({
          messageType: 'handshake',
        });

      } else if (
          messageType === 'get-element-stats' ||
          messageType === 'clear-element-stats') {
        console.log('messageType', messageType);
        // relay to content script
        const tabId = message.tabId;
        const pagePort = pagePorts.get(tabId);
        pagePort.postMessage({
          messageType: messageType,
        });
      }
    });

  } else if (port.name == 'element-zones') {
    console.log('element-zones.onConnect', port, port.sender.tab.id);
    // save the port to the element-zones content script
    pagePorts.set(port.sender.tab.id, port);
    port.onMessage.addListener((message, port) => {
      if (message.messageType == 'element-stats') {
        console.log('element-stats', message.data);
        // post to devtools panel
        const tabId = port.sender.tab.id;
        const polymerPanelPort = polymerPanelPorts.get(port.sender.tab.id);
        console.log('polymer panel port', tabId, polymerPanelPort);
        console.assert(polymerPanelPort != null);
        polymerPanelPort.postMessage({
          messageType: 'element-stats',
          data: message.data,
        });
      }
    });
  }
});

// chrome.extension.onDisconnect.addListener((port) => {
//   if (port.name == 'element-zones') {
//     console.log('element-zones.onDisconnect', port);
//     pagePorts.remove(port.sender.tab.id);
//   }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('background chrome.runtime.onMessage', request, sender);
  if (request.messageType == 'get_times') {
    console.log('background get_times');
  }
});
