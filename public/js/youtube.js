const { GoogleApis } = require("googleapis");

console.log("youtube.js connected")

const CLIENT_ID = '948874822377-l00i4u7e9sphg2d4vv25cukghm8jh7pv.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = 'https://www.googleapis/com/auth/youtube.readonly'

// Access to html buttons via DOM
const authorizeButton = document.getElementById('authorize-button')
const signoutButton = document.getElementById('signout-button')

const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');

const defaultChannel = 'techguyweb';

// Load auth2 library
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
};

// Init API client library and setup sign in listeners
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(() => {
    // Listen for sign in state changes
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle initial sign in status
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignOutClick;
  })
}

// Update UI sign in state changes
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    content.style.display = 'none';
    videoContainer.style.display = 'none';
    getChannel(defaultChannel);
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    content.style.display = 'none';
    videoContainer.style.display = 'none';

  }
}

// Handle login
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signIn();
}

// Handle logout
function handleAuthClick() {
  gapi.auth2.getAuthInstance().signOut();
}

// Get channel from API
function getChannel(channel) {
  console.log(channel)
}