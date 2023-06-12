// Every 10 seconds, check if alert_class exists on the page
let numofAlerts = 0;

setInterval(function () {
  var alertCount = document.querySelectorAll(
    ".nav--primary__item .u-icon--circle-warning"
  ).length;

  // Set the title to indicate the number of alerts
  if (alertCount > 0) {
    document.title = `${alertCount} Alerts!`;
  }

  // Only send a notification if the alert number for this interval is greater than the previous interval
  if (alertCount > numofAlerts) {
    // Send message to background.js to notify the user
    chrome.runtime.sendMessage({ message: "notification" });
  }

  // Set the number of alerts to the current alert count
  numofAlerts = alertCount;
}, 1000);