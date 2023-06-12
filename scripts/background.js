
const demo = "https://demo.shepherd.vet/";
const production = "https://app.shepherd.vet/";

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url.startsWith(demo) || tab.url.startsWith(production)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === 'ON' ? 'OFF' : 'ON'

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === "ON") {
      // Inject the content script when the extension is 'ON'
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["scripts/notifier.js"],
      });
    } else {
    }
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "notification"){
      // Notify the user of the aler
      chrome.notifications.create({
        type: "basic",
        iconUrl: "/icon.png",
        title: "Shepherd Alert!",
        message: "You have a new alert in Shepherd!",
      });

      playSound();
    }

  }
);

/**
 * Plays audio files from extension service workers
 * @param {string} source - path of the audio file
 * @param {number} volume - volume of the playback
 */
async function playSound(source = 'ding.mp3', volume = 1) {
  await createOffscreen();
  await chrome.runtime.sendMessage({ play: { source, volume } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'testing' // details for using the API
  });
}