/**
 * @license
 * Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

(function() {
  'use strict';

  let zoneJsScript = getFile('/vendor/zone-microtask.js');
  let elementZonesScript = getFile('/vendor/element-zones.js');
  let script = document.createElement('script');
  let root = document.body || document.head || document.documentElement;

  script.appendChild(document.createTextNode(zoneJsScript));
  root.appendChild(script);

  script = document.createElement('script');
  script.appendChild(document.createTextNode(elementZonesScript));
  root.appendChild(script);

  let backgroundPageConnection = chrome.runtime.connect({
    name: 'element-zones',
  });

  // Forward requests for element stats to the target page.
  backgroundPageConnection.onMessage.addListener(function(request, sender, sendResponse) {
    window.postMessage({
      messageType: request.messageType,
      detail: request.detail,
    }, '*');
  });

  // Forward element-stats responses from the target page to the background page
  // to be further forwarded to the polymer-panel
  window.addEventListener('message', function(event) {
    if (event.data.messageType == 'element-stats' ||
        event.data.messageType == 'element-stats-clear') {
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
    return response + '\n\n//# sourceURL=polydev' + localUrl;
  }

})();
