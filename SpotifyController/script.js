const clientId = '6bbf93037aa3436d9da5f97488cc610a'; // Spotify Client ID found at spotify for developers dashboard!
const redirectUrl = 'https://elias4044.netlify.app/spotifycontroller/index.html';
const scopes = 'user-read-playback-state user-modify-playback-state';

const loginBtn = document.getElementById('login-btn');
const contentDiv = document.getElementById('content');
const trackNameEl = document.getElementById('track-name');
const artistNameEl = document.getElementById('artist-name'); 
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const unlinkBtn = document.getElementById('unlink-btn');
const albumCoverEl = document.getElementById('album-cover');
const nextSongPreview = document.getElementById('next-song-preview');
const playPauseIcon = document.getElementById('play-pause-icon');

let token = null; // Stores the token here for easy access
let pollingInterval = null; // To control the interval

loginBtn.addEventListener('click', () => {
  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUrl)}&scope=${encodeURIComponent(scopes)}`;
  window.location.href = url;
});

// After login, handle the redirect and access token
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash) {
    token = getTokenFromUrl();
    if (token) {
      loginBtn.style.display = 'none';
      contentDiv.style.display = 'block';
      getCurrentTrack(token); // Get the initial track info

      playPauseBtn.addEventListener('click', () => {
        // Temporarily stops polling when the play/pause button is clicked
        clearInterval(pollingInterval);
        togglePlayPause(token);
      });
      prevBtn.addEventListener('click', () => {
        skipToPrevious(token);
      });
      nextBtn.addEventListener('click', () => {
        skipToNext(token);
      });
      unlinkBtn.addEventListener('click', () => logOut());

      // Starts polling to update track info every 1 second
      pollingInterval = setInterval(() => {
        getCurrentTrack(token);
      }, 1000);
    }
  }
});

function getTokenFromUrl() {
  const hash = window.location.hash;
  return hash.split('&')[0].split('=')[1];
}


function getCurrentTrack(token) {
  fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.item) {
        trackNameEl.textContent = data.item.name;
        artistNameEl.textContent = `Artist: ${data.item.artists[0].name}`; // Updates artist name
        albumCoverEl.src = data.item.album.images[0].url; // Updates album cover

        if (data.is_playing) {
          if (!playPauseIcon.classList.contains('fa-pause')) {
            playPauseIcon.classList.replace('fa-play', 'fa-pause');
          }
        } else {
          if (!playPauseIcon.classList.contains('fa-play')) {
            playPauseIcon.classList.replace('fa-pause', 'fa-play');
          }
        }
      } else {
        trackNameEl.textContent = 'No track currently playing';
        artistNameEl.textContent = '';
        albumCoverEl.src = ''; // Clears album cover
      }
    });
}

function togglePlayPause(token) {
  // Optimistically updates the UI for faster response
  if (playPauseIcon.classList.contains('fa-play')) {
    playPauseIcon.classList.replace('fa-play', 'fa-pause');
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(() => {
      setTimeout(() => {
        getCurrentTrack(token); // Updates the track info to reflect the new state
      }, 200); // Delay of 500 milliseconds before updating the track info
    })
    .catch(() => {
      // Reverts the icon if there's an error
      playPauseIcon.classList.replace('fa-pause', 'fa-play');
    });
  } else {
    playPauseIcon.classList.replace('fa-pause', 'fa-play');
    fetch('https://api.spotify.com/v1/me/player/pause', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(() => {
      setTimeout(() => {
        getCurrentTrack(token); // Update the track info to reflect the new state
      }, 200); // Delay of 500 milliseconds before updating the track info
    })
    .catch(() => {
      // Reverts the icon if there's an error
      playPauseIcon.classList.replace('fa-play', 'fa-pause');
    });
  }
}

function resumePolling() {
  // Resumes polling after a delay to give Spotify time to process
  setTimeout(() => {
    pollingInterval = setInterval(() => {
      getCurrentTrack(token);
    }, 1000);
  }, 1500); // Small delay (1.5 seconds) to avoid double updates
}

function skipToPrevious(token) {
  fetch('https://api.spotify.com/v1/me/player/previous', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(() => getCurrentTrack(token)); // Refreshes current track info
}

function skipToNext(token) {
  fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(() => getCurrentTrack(token)); // Refreshes current track info
}

// Log out function (clears the token from the URL)
function logOut() {
  window.location.hash = '';  // Clearss the token from the URL
  contentDiv.style.display = 'none';  // Hides the player content
  loginBtn.style.display = 'block';  // Shows the login button again
}

// Shows a preview of the next song when hovering over the next button - IN PORGRESS - NOT DONE
function showPreview() {
  const token = getTokenFromUrl(); // Gets the access token from the URL
  fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.item) {
        nextSongPreview.textContent = `Next: ${data.item.name} by ${data.item.artists[0].name}`;
        nextSongPreview.style.display = 'block'; // Shows the preview
      }
    });
}

// Hides the next song preview
function hidePreview() {
  nextSongPreview.style.display = 'none'; // Hides the preview
}

document.addEventListener("keydown", function(event) {
  // Check if the key pressed is the spacebar (key code 32)
  if (event.code === "Space") {
      console.log("Spacebar was pressed!");
      // You can add any other function you want to trigger here
  }
});