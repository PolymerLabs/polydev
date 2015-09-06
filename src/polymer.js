<!--
@license
Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
-->
// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "polymer-panel"
});

backgroundPageConnection.onMessage.addListener(function (message, sender) {
  // Handle responses from the background page, if any
  if (message.messageType && message.messageType == 'element-stats') {
    var statsContainer = document.querySelector('#stats');
    while (statsContainer.firstChild) {
      statsContainer.removeChild(statsContainer.firstChild);
    }

    var table = document.createElement('table');
    var header = document.createElement('tr');
    table.appendChild(header);

    var elementHeader = document.createElement('th');
    elementHeader.appendChild(document.createTextNode('Element'));
    header.appendChild(elementHeader);

    var timeHeader = document.createElement('th');
    timeHeader.appendChild(document.createTextNode('Count'));
    header.appendChild(timeHeader);

    var timeHeader = document.createElement('th');
    timeHeader.appendChild(document.createTextNode('Time'));
    header.appendChild(timeHeader);

    var createdHeader = document.createElement('th');
    createdHeader.appendChild(document.createTextNode('Created'));
    header.appendChild(createdHeader);

    var attachedHeader = document.createElement('th');
    attachedHeader.appendChild(document.createTextNode('Attached'));
    header.appendChild(attachedHeader);

    var detachedHeader = document.createElement('th');
    detachedHeader.appendChild(document.createTextNode('Detached'));
    header.appendChild(detachedHeader);

    var attributesHeader = document.createElement('th');
    attributesHeader.appendChild(document.createTextNode('Attribute Changed'));
    header.appendChild(attributesHeader);

    var data = message.data;
    for (var tag in data) {
      var tagData = data[tag];
      var totalTime = 0;
      totalTime += (tagData.created) ? tagData.created.totalTime : 0;
      totalTime += (tagData.attached) ? tagData.attached.totalTime : 0;
      totalTime += (tagData.detached) ? tagData.detached.totalTime : 0;
      totalTime += (tagData.attributeChanged) ? tagData.attributeChanged.totalTime : 0;

      var row = document.createElement('tr');

      var tagCell = document.createElement('td');
      tagCell.appendChild(document.createTextNode(tag));
      row.appendChild(tagCell);

      var countCell = document.createElement('td');
      countCell.appendChild(document.createTextNode(`${tagData.count}`));
      row.appendChild(countCell);

      var timeCell = document.createElement('td');
      timeCell.appendChild(document.createTextNode(totalTime.toFixed(3)));
      row.appendChild(timeCell);

      var createdCell = document.createElement('td');
      var createdTime = (tagData.created) ? tagData.created.totalTime.toFixed(3) : '';
      createdCell.appendChild(document.createTextNode(createdTime));
      row.appendChild(createdCell);

      var attachedCell = document.createElement('td');
      var attachedTime = (tagData.attached) ? tagData.attached.totalTime.toFixed(3) : '';
      attachedCell.appendChild(document.createTextNode(attachedTime));
      row.appendChild(attachedCell);

      var detachedCell = document.createElement('td');
      var detachedTime = (tagData.detached) ? tagData.detached.totalTime.toFixed(3) : '';
      detachedCell.appendChild(document.createTextNode(detachedTime));
      row.appendChild(detachedCell);

      var attributesCell = document.createElement('td');
      var attributesTime = (tagData.attributeChanged) ? tagData.attributeChanged.totalTime.toFixed(3) : '';
      attributesCell.appendChild(document.createTextNode(attributesTime));
      row.appendChild(attributesCell);

      table.appendChild(row);
    }
  }
  statsContainer.appendChild(table);
});

backgroundPageConnection.postMessage({
  messageType: 'tab-id',
  tabId: chrome.devtools.inspectedWindow.tabId,
});

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector('#status').textContent = 'Ready';
  document.querySelector('#go').addEventListener('click', function() {
    backgroundPageConnection.postMessage({
      messageType: 'get-element-stats',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  });
});
