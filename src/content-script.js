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

(function() {
  'use strict';

  const measurementsScript =
      getFile('/src/document-context/measure-custom-elements.js');

  const root = document.body || document.head || document.documentElement;

  const script = document.createElement('script');
  script.appendChild(document.createTextNode(measurementsScript));
  root.appendChild(script);

  const backgroundPageConnection = chrome.runtime.connect({
    name: 'element-zones',
  });

  // Forward requests for element stats to the target page.
  backgroundPageConnection.onMessage.addListener(
      (request, sender, sendResponse) => {
        window.postMessage({messageType: request.messageType}, '*');
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
    xhr.onload = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          response = xhr.responseText;
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function() {
      console.error(xhr.statusText);
    };
    xhr.send(null);
    return response + '\n\n//# sourceURL=polydev' + localUrl;
  }

})();