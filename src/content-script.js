(function() {
  'use strict';

  let zoneJsScript = getFile('/vendor/zone-microtask.js');
  let elementZonesScript = getFile('/vendor/element-zones.js');
  let script = document.createElement('script');
  script.appendChild(document.createTextNode(zoneJsScript));
  script.appendChild(document.createTextNode(elementZonesScript));
  (document.body || document.head || document.documentElement).appendChild(script);

  let backgroundPageConnection = chrome.runtime.connect({
    name: 'element-zones',
  });

  // Forward requests for element stats to the target page.
  backgroundPageConnection.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('onMessage', request);
    window.postMessage({
      messageType: 'get-element-stats',
    }, '*');
  });

  // Forward element-stats responses from the target page to the background page
  // to be further forwarded to the polymer-panel
  window.addEventListener('message', function(event) {
    if (event.data.messageType == 'element-stats') {
      backgroundPageConnection.postMessage(event.data);
    }
  });

  // Synchronously read a file packaged with the extension. The file must be
  // listed in the "web_accessible_resources" section of manifest.json
  function getFile(localUrl) {
    let extensionUrl = chrome.extension.getURL(localUrl);
    let xhr = new XMLHttpRequest();
    let response = null;

    xhr.open('GET', extensionUrl, false);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(`loaded ${localUrl}`);
          response = xhr.responseText;
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
    console.log(`returning ${localUrl}`);
    return response;
  }

})();
