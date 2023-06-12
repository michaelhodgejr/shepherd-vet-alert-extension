// Every 10 seconds, check if alert_class exists on the page

let hasAlert = false;

setInterval(function () {
  var alertSelector = document.querySelector('.u-icon--circle-warning');

  if (alertSelector) {
    // Do not send a notification if we notified the user already
    if (!hasAlert) {
      document.title = "Shepherd Alert!"

      // Send message to background.js to notify the user
      chrome.runtime.sendMessage({message: "notification"});

      // Set hasAlert to true so we don't send another notification
      hasAlert = true;
    }else {
      // We've already notified the user of this alert so do nothing
      document.title = "Shepherd";
    }
  }else{
    // No alert found, reset the hasAlert variable
    hasAlert = false;
  }
}, 10000);