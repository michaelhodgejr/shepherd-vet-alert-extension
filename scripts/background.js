chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "notification") {
    // Notify the user of the aler
    chrome.notifications.create({
      type: "basic",
      iconUrl: "/icon.png",
      title: "Shepherd Alert!",
      message: "You have a new alert in Shepherd!",
    });

    playSound();
  }
});

/**
 * Plays audio files from extension service workers
 * @param {string} source - path of the audio file
 * @param {number} volume - volume of the playback
 */
async function playSound(source = "ding.mp3", volume = 1) {
  await createOffscreen();
  await chrome.runtime.sendMessage({ play: { source, volume } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: "offscreen.html",
    reasons: ["AUDIO_PLAYBACK"],
    justification: "testing", // details for using the API
  });
}
