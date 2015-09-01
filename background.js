console.log("background page loaded!!!");

// notify of page refreshes
chrome.extension.onConnect.addListener(function(port) {
	if (port.name == "devtools-page") {
		console.log('devtools-page.onConnect', port);
	}
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log('chrome.runtime.onMessage', sender);
	console.dir(request);
	// chrome.tabs.executeScript(request.tabId, {
	// 	file: 'elementZones.js',
	// });
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
