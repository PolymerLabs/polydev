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
    // var keysHeader = document.createElement('th');
    // keysHeader.appendChild(document.createTextNode('Data'));
    // header.appendChild(keysHeader);

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
      var row = document.createElement('tr');
      var tagCell = document.createElement('td');
      tagCell.appendChild(document.createTextNode(tag));
      row.appendChild(tagCell);
      var countCell = document.createElement('td');
      countCell.appendChild(document.createTextNode('' + tagData.count));
      row.appendChild(countCell);
      var timeCell = document.createElement('td');
      timeCell.appendChild(document.createTextNode('' + tagData.totalTime.toFixed(3)));
      row.appendChild(timeCell);
      // var keysCell = document.createElement('td');
      // keysCell.appendChild(document.createTextNode('' + JSON.stringify(data[tag])));
      // row.appendChild(keysCell);

      var createdCell = document.createElement('td');
      var createdTime = ' ';
      try {
        createdTime = ' ' + tagData.created.totalTime.toFixed(3);
      } catch (e) {}
      createdCell.appendChild(document.createTextNode(createdTime));
      row.appendChild(createdCell);

      var attachedCell = document.createElement('td');
      var attachedTime = ' ';
      try {
        attachedTime = ' ' + tagData.attached.totalTime.toFixed(3);
      } catch (e) {}
      attachedCell.appendChild(document.createTextNode(attachedTime));
      row.appendChild(attachedCell);

      var detachedCell = document.createElement('td');
      var detachedTime = ' ';
      try {
        detachedTime = ' ' + tagData.detached.totalTime.toFixed(3);
      } catch (e) {}
      detachedCell.appendChild(document.createTextNode(detachedTime));
      row.appendChild(detachedCell);

      var attributesCell = document.createElement('td');
      var attributesTime = ' ';
      try {
        attributesTime = ' ' + tagData.attributeChanged.totalTime.toFixed(3);
      } catch (e) {}
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

// window.addEventListener("message", function(event) {
//   console.log("message", event);
// });

document.addEventListener("DOMContentLoaded", function(event) {
  document.querySelector('#status').textContent = 'Ready';
  document.querySelector('#go').addEventListener('click', function() {
    // Relay the tab ID to the background page
    // chrome.runtime.sendMessage('kcoiaofoedgogmnganogddeagelgkcgh', {
    // // chrome.runtime.sendMessage({
    //   messageType: 'get_times',
    //   tabId: chrome.devtools.inspectedWindow.tabId,
    // });

    backgroundPageConnection.postMessage({
      messageType: 'get-element-stats',
      tabId: chrome.devtools.inspectedWindow.tabId,
    });
  });
});
