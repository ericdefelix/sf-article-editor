// =================================================================================
// Background.js gets called first. It listens to all window instances and
// the tabs and popups created under each instance.
// =================================================================================
import {
  UrlContainsArticleEdit,
  RequestIsValid,
  SetPosition
} from '/modules/utils/chromeExtensionUtils.js';

const background = {
  crxID: '',
  currentTabID: '',
  crxUpdating: false,
  contentData: '',
  activeWindows: [],
  activeTabs: [],
  activeContentEditorInstances: [],
  requests: [],
  init: function () {},
  listeners: function () {
    chrome.runtime.requestUpdateCheck(function (data) {
      console.log(data);
    });

    chrome.runtime.onInstalled.addListener(function (details) {
      chrome.tabs.query({}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
          const tab = tabs[i];
          if (UrlContainsArticleEdit(tab.url) && details.reason === 'install') {
            background.currentTabID = tab.id;
            chrome.tabs.update(tab.id, {
              highlighted: true
            });
            chrome.tabs.reload(tab.id);
          }
        }
      });
    });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      const method = request.method;

      if (RequestIsValid(request)) background.methods[method](request);
      sendResponse({
        message: 'yes'
      });
    });
  },
  tabRunsPlugin: function (tabId) {
    if (background.activeTabs.length === 0 || background.activeTabs.indexOf(tabId) == -1) {
      return false;
    } else {
      return true;
    }
  },
  methods: {
    popup: (request) => {
      const ph = 800,
        pw = 1100;
      const data = request.data;

      const px = SetPosition(data.dimensions.win_left, data.dimensions.win_width, pw);
      const py = SetPosition(data.dimensions.win_top, data.dimensions.win_height, ph);

      const popupWindowConfig = {
        url: 'index.html',
        type: 'popup',
        height: ph,
        width: pw,
        left: Math.round(px),
        top: Math.round(py)
      };

      const registerWindow = () => {
        chrome.tabs.query({
          active: true,
          currentWindow: true
        }, function (tabs) {
          const currTab = tabs[0];
          if (currTab) {
            chrome.windows.create(popupWindowConfig, function (win) {
              chrome.windows.getCurrent({
                populate: true
              }, function (currentWindow) {
                const activeWindow = {
                  windowID: currentWindow.id,
                  instanceID: request.data.contentEditorInstanceId
                };

                background.activeWindows.push(activeWindow);
                background.activeContentEditorInstances.push(request.data.contentEditorInstanceId);
                chrome.storage.local.set({
                  image_gallery: request.data.image_gallery
                });
                chrome.storage.local.set({
                  tab_id: currTab.id
                });
                chrome.storage.local.set({
                  popup_id: currentWindow.id
                });
                chrome.storage.local.set({
                  contentEditorInstanceId: request.data.contentEditorInstanceId
                });
              });
            });
          }
        });
      };

      if (data.display) {
        chrome.storage.local.set({
          instanceHTML: request.data.instanceHTML
        }, registerWindow);
      }
    },
    insertToContentEditor: (request) => {
      const tabId = parseInt(request.data.tabId);

      chrome.tabs.sendMessage(tabId, request, function () {
        chrome.windows.getCurrent(function (w) {
          chrome.tabs.getSelected(w.id, function (response) {
            chrome.windows.remove(response.windowId);
          });
        });
      });
    },
    openImageUpload: (request) => {
      chrome.tabs.sendMessage(background.currentTabID, request);
    },
    initEditor: (request) => {},
    closePopups: (request) => {
      for (var i = 0; i <= background.activeWindows - 1; i++) {
        chrome.windows.remove(background.activeWindows[i].windowID);
      }
    }
  },
  run: function () {
    background.init();
    background.listeners();
  }
};

background.run();