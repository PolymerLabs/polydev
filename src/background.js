console.log("background page loaded!!!");

var pagePorts = new Map();
var polymerPanelPorts = new Map();

// listen for polymer devtools panel, and element-zones content
// script connections
chrome.extension.onConnect.addListener(function(port) {
	if (port.name == "polymer-panel") {
		console.log('background devtools-page.onConnect', port);
		port.onMessage.addListener(function(message, port) {
			console.log('from polymer-panel', message, port);
			if (message.messageType && message.messageType == 'tab-id') {
				// save the port to the polymer devtools panel
				polymerPanelPorts.set(message.tabId, port);
			} else if (message.messageType && message.messageType == 'get-element-stats') {
				// relay to content script
				var tabId = message.tabId;
				var pagePort = pagePorts.get(tabId);
				pagePort.postMessage({
					messageType: 'get-element-stats',
				});
			}
		});
	} else if (port.name == "element-zones") {
		console.log('element-zones.onConnect', port, port.sender.tab.id);
		// save the port to the element-zones content script
		pagePorts.set(port.sender.tab.id, port);
		port.onMessage.addListener(function(message, port) {
			if (message.messageType == 'element-stats') {
				console.log('element-stats', message.data);
				// post to devtools panel
				var tabId = port.sender.tab.id;
				var polymerPanelPort = polymerPanelPorts.get(port.sender.tab.id);
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

// chrome.extension.onDisconnect.addListener(function(port) {
// 	if (port.name == 'element-zones') {
// 		console.log('element-zones.onDisconnect', port);
// 		pagePorts.remove(port.sender.tab.id);
// 	}
// });

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('background chrome.runtime.onMessage', request, sender);
	if (request.messageType == 'get_times') {
		console.log('background get_times');
	}
});

//
// // Background page -- background.js
// chrome.runtime.onConnect.addListener(function(devToolsConnection) {
// 	console.log('chrome.runtime.onConnect');
// 	console.dir(devToolsConnection);
//
//   // assign the listener function to a variable so we can remove it later
//   var devToolsListener = function(message, sender, sendResponse) {
// 		console.log('devToolsConnection.onMessage', message, sender);
//     // Inject a content script into the identified tab
//     chrome.tabs.executeScript(message.tabId,
//         { file: message.scriptToInject });
//   }
//   // add the listener
//   devToolsConnection.onMessage.addListener(devToolsListener);
//
//   devToolsConnection.onDisconnect.addListener(function() {
//        devToolsConnection.onMessage.removeListener(devToolsListener);
//   });
// });
