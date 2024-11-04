const clientId = '6bbf93037aa3436d9da5f97488cc610a'; // Replace with your Spotify client ID
const redirectUri = 'http://127.0.0.1:5500/SpotifyController/index.html';
const scopes = 'user-read-playback-state user-modify-playback-state';

const loginBtn = document.getElementById('login-btn');
const contentDiv = document.getElementById('content');
const trackNameEl = document.getElementById('track-name');
const artistNameEl = document.getElementById('artist-name'); // Added artist name element
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const unlinkBtn = document.getElementById('unlink-btn');
const albumCoverEl = document.getElementById('album-cover');
const nextSongPreview = document.getElementById('next-song-preview');
const playPauseIcon = document.getElementById('play-pause-icon'); // Icon reference

let token = null; // Store the token here for easy access
let pollingInterval = null; // To control the interval

loginBtn.addEventListener('click', () => {
  const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
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
        // Temporarily stop polling when the play/pause button is clicked
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

      // Start polling to update track info every 1 second
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
        artistNameEl.textContent = `Artist: ${data.item.artists[0].name}`; // Update artist name
        albumCoverEl.src = data.item.album.images[0].url; // Update album cover

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
        albumCoverEl.src = ''; // Clear album cover
      }
    });
}

function togglePlayPause(token) {
  // Optimistically update the UI for faster response
  if (playPauseIcon.classList.contains('fa-play')) {
    playPauseIcon.classList.replace('fa-play', 'fa-pause');
    fetch('https://api.spotify.com/v1/me/player/play', {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(() => {
      setTimeout(() => {
        getCurrentTrack(token); // Update the track info to reflect the new state
      }, 500); // Delay of 500 milliseconds before updating the track info
    })
    .catch(() => {
      // Revert the icon if there's an error
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
      }, 500); // Delay of 500 milliseconds before updating the track info
    })
    .catch(() => {
      // Revert the icon if there's an error
      playPauseIcon.classList.replace('fa-play', 'fa-pause');
    });
  }
}

function resumePolling() {
  // Resume polling after a delay to give Spotify time to process
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
  }).then(() => getCurrentTrack(token)); // Refresh current track info
}

function skipToNext(token) {
  fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + token }
  }).then(() => getCurrentTrack(token)); // Refresh current track info
}

// Log out function (clear the token from the URL)
function logOut() {
  window.location.hash = '';  // Clears the token from the URL
  contentDiv.style.display = 'none';  // Hide the player content
  loginBtn.style.display = 'block';  // Show the login button again
}

// Show preview of the next song when hovering over the next button
function showPreview() {
  const token = getTokenFromUrl(); // Get the access token from the URL
  fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + token }
  })
    .then(response => response.json())
    .then(data => {
      if (data && data.item) {
        nextSongPreview.textContent = `Next: ${data.item.name} by ${data.item.artists[0].name}`;
        nextSongPreview.style.display = 'block'; // Show the preview
      }
    });
}

// Hide the next song preview
function hidePreview() {
  nextSongPreview.style.display = 'none'; // Hide the preview
}
