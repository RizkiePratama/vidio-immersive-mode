(function () {
  var isImmersive = false;
  var vjsContainer = null;
  var vjsControlBar = null;
  var newBtn = null;
  var vidioBody = null;
  var chatBoxContainer = null;
  var browser = browser || false;
  var isFirefox = browser ? true : false;
  var isLive = false;

  // Load Browser SEttings
  if (!isFirefox) {
    // Do Chrome Stuff
    chrome.storage.sync.get(null, loadBrowserSettings);
  } else {
    // Do Firefox Stuff
    browser.storage.synce.get().then(loadBrowserSettings);
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

    if (isLive) {
      chatBoxContainer = document.querySelector('.livestreaming-discussion');
      vjsContainer = document.querySelector(".livestreaming__player-container")
    } else {
      vjsContainer = document.querySelector("#article-player")
    }

    vjsControlBar = document.querySelector(".vjs-control-bar");
    vidioBody = document.querySelector("body");

    createControls();
  }

  function createControls() {
    var nodes = vjsControlBar.childNodes;
    var fscPos = clPos = nodes.length;

    if (isLive) {
      fscPos -= 2;
      clPos -= 2;
    } else {
      fscPos -= 3;
      clPos -= 4;
    }

    var fscBtn = nodes[fscPos];
    newBtn = nodes[clPos].cloneNode(true);
    newBtn.title = 'Immersive Mode';
    newBtn.className = 'vjs-immersive-mode-button vjs-control vjs-button'
    updateBtnIcon();
    newBtn.addEventListener('click', toggleImmersive);
    fscBtn.before(newBtn);
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
    vjsContainer.classList.toggle("immersive-mode");
    vidioBody.classList.toggle("immersive-body")
    isImmersive = true;
  }

  function exitImmersiveMode() {
    vjsContainer.classList.toggle("immersive-mode");
    vidioBody.classList.toggle("immersive-body")
    isImmersive = false;
  }
}());
