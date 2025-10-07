(function () {
  var isImmersive = false;
  var playerContainer = null;
  var playerControlBar = null;
  var newBtn = null;
  var vidioBody = null;
  var browser = browser || false;
  var isFirefox = browser ? true : false;
  var isLive = false;
  var isShakaPlayer = false;
  var controlsCreated = false;

  // Load Browser SEttings
  if (!isFirefox) {
    // Do Chrome Stuff
    chrome.storage.sync.get(null, loadBrowserSettings);
  } else {
    // Do Firefox Stuff
    browser.storage.sync.get().then(loadBrowserSettings);
  }

  function loadBrowserSettings(items) {
    // Not Doing Anything at The Moment except starting the main script
    loadOnPageReady();
  }

  function loadOnPageReady() {
    window.addEventListener("load", function() {
      setTimeout(initVidioImmersiveMode, 3000);
    });
  }

  function initVidioImmersiveMode() {
    isLive = window.location.pathname.split('/')[1] == 'live' ? true : false;

    // Try to detect Video.js player
    if (isLive) {
      playerContainer = document.querySelector(".player-component-wrapper");
    } else {
      playerContainer = document.querySelector("#article-player");
    }

    playerControlBar = document.querySelector(".vjs-control-bar");

    // If Video.js player not found, try to detect Shaka Player
    if (!playerContainer || !playerControlBar) {
      playerContainer = document.querySelector(".shaka-player-container");
      if (playerContainer) {
        isShakaPlayer = true;
        console.log("Vidio Immersive Mode: Shaka Player container detected. Waiting for controls...");
        waitForShakaControls();
        return; // Exit for now, controls will be created once found
      }
    }

    // If no player container or control bar is found, exit
    if (!playerContainer || !playerControlBar) {
      console.log("Vidio Immersive Mode: No compatible player found.");
      return;
    } else if (!isShakaPlayer) {
      console.log("Vidio Immersive Mode: Video.js player detected.");
    }

    vidioBody = document.querySelector("body");
    createControls();
  }

  function waitForShakaControls() {
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          playerControlBar = playerContainer.querySelector('[data-testid="controller-panel"]');
          if (playerControlBar && !controlsCreated) {
            console.log("Vidio Immersive Mode: Shaka Player controls found.");
            observer.disconnect();
            vidioBody = document.querySelector("body");
            createControls();
            controlsCreated = true;
          }
        }
      });
    });

    observer.observe(playerContainer, { childList: true, subtree: true });

    setTimeout(function() {
      if (!playerControlBar) {
        console.log("Vidio Immersive Mode: Shaka Player controls not found after timeout.");
      }
    }, 300000); // Timeout Waiting Player to Start after 5 Minutes
  }

  function createControls() {
    var nodes = playerControlBar.childNodes;
    var fscBtn = null;
    var clPos = nodes.length;

    if (isShakaPlayer) {
      fscBtn = playerControlBar.querySelector('[data-testid="fullscreen-button"]');
      if (fscBtn) {
        newBtn = fscBtn.cloneNode(true);
        newBtn.title = 'Immersive Mode';
        newBtn.className = 'shaka-immersive-mode-button p8siU1dZviglbdDe3TAQ'; // Keep original Shaka button class
        newBtn.setAttribute('data-testid', 'immersive-mode-button');
        newBtn.addEventListener('click', toggleImmersive);
        fscBtn.before(newBtn);
      } else {
        // Fallback if no fullscreen button found, append to control bar
        newBtn = document.createElement('button');
        newBtn.title = 'Immersive Mode';
        newBtn.className = 'shaka-immersive-mode-button p8siU1dZviglbdDe3TAQ'; // Use Shaka's button class
        newBtn.setAttribute('data-testid', 'immersive-mode-button');
        newBtn.addEventListener('click', toggleImmersive);
        playerControlBar.appendChild(newBtn);
      }
    } else {
      // Existing Video.js logic
      var fscPos = clPos;

      if (isLive) {
        fscPos -= 2;
        clPos -= 2;
      } else {
        fscPos -= 3;
        clPos -= 4;
      }

      fscBtn = nodes[fscPos];
      newBtn = nodes[clPos].cloneNode(true);
      newBtn.title = 'Immersive Mode';
      newBtn.className = 'vjs-immersive-mode-button vjs-control vjs-button'
      newBtn.addEventListener('click', toggleImmersive);
      fscBtn.before(newBtn);
    }
    updateBtnIcon();
  }

  function toggleImmersive() {
    if (!isImmersive) {
      startImmersiveMode();
    } else {
      exitImmersiveMode();
    }

    updateBtnIcon();
  }

  function updateBtnIcon() {
    if(!isImmersive) {
      newBtn.innerHTML = '<svg width=\"20\" height=\"28\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M883 1056q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23zm781-864v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45z\" style=\"fill: white;\"></path></svg>';
    } else {
      newBtn.innerHTML = '<svg width=\"20\" height=\"28\" viewBox=\"0 0 1792 1792\" xmlns=\"http://www.w3.org/2000/svg\" class=\"svg-container\"><path d=\"M896 960v448q0 26-19 45t-45 19-45-19l-144-144-332 332q-10 10-23 10t-23-10l-114-114q-10-10-10-23t10-23l332-332-144-144q-19-19-19-45t19-45 45-19h448q26 0 45 19t19 45zm755-672q0 13-10 23l-332 332 144 144q19 19 19 45t-19 45-45 19h-448q-26 0-45-19t-19-45v-448q0-26 19-45t45-19 45 19l144 144 332-332q10-10 23-10t23 10l114 114q10 10 10 23z\" style=\"fill: white;\"></path></svg>';
    }
  }

  function startImmersiveMode() {
    playerContainer.classList.toggle("immersive-mode");
    vidioBody.classList.toggle("immersive-body")
    isImmersive = true;
  }

  function exitImmersiveMode() {
    playerContainer.classList.toggle("immersive-mode");
    vidioBody.classList.toggle("immersive-body")
    isImmersive = false;
  }
}());
