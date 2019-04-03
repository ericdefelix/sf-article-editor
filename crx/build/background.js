// =================================================================================
// Background.js gets called first. It listens to all window instances and
// the tabs and popups created under each instance.
// =================================================================================
import { UrlContainsArticleEdit, RequestIsValid, SetPosition } from '/modules/utils/chromeExtensionUtils.js';

let background = {
  crxID: '',
  currentTabID: '',
  crxUpdating: false,
  currentCkeditorInstance: '',
  
  activeWindows: [],
  activeContentEditorInstances: [],
  requests: [],
  init: function () {
  },
  listeners: function () {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status == 'complete') {
        chrome.tabs.executeScript({
          file: 'index.js',
          runAt: 'document_end'
        });
      }

      // if (background.crxUpdating) {
      //   chrome.tabs.executeScript({
      //     file: 'index.js',
      //     runAt: 'document_end'
      //   });
      // }
      // else {
      //   if (changeInfo.status == 'loading' && UrlContainsArticleEdit(tab.url)) {
      //     chrome.tabs.executeScript({
      //       file: 'index.js',
      //       runAt: 'document_end'
      //     });
      //   }

      //   if (changeInfo.status == 'complete' && UrlContainsArticleEdit(tab.url)) {
      //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      //       background.currentTabID = tabs[0].id;
      //     });
      //   }
      // }
    });

    chrome.runtime.onInstalled.addListener(function () {
      chrome.tabs.query({}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
          const tab = tabs[i];

          if (UrlContainsArticleEdit(tab.url)) {
            background.currentTabID = tab.id;
            background.crxUpdating = true;
            chrome.tabs.reload(tab.id, {}, function () {
              // chrome.tabs.executeScript({
              //   file: 'index.js',
              //   runAt: 'document_end'
              // });
            });

            break;
          } 
        }
      });
    });

    // chrome.tabs.onRemoved.addListener((tabId, changeInfo, tab) => {
    //   console.log(tab);
    // });

    // chrome.windows.onRemoved.addListener((tabId, changeInfo, tab) => {
    //   console.log(tab);
    // });

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
      const method = request.method;
      
      if (RequestIsValid(request)) background.methods[method](request);
      sendResponse({ message: 'yes' });
    });
  },
  methods: {
    popup: (request) => {
      const ph = 800, pw = 1100;
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

      const editorDataFromWebpage = {
        method: 'initEditor',
        data: {
          instanceHTML: data.instanceHTML,
          contentEditorInstanceId: data.contentEditorInstanceId
        }
      };

      chrome.runtime.sendMessage(editorDataFromWebpage);

      if (data.display) {
        chrome.windows.create(popupWindowConfig, function (win) {
          chrome.windows.getCurrent({ populate: true }, function (currentWindow) {
            const activeWindow = {
              windowID: currentWindow.id,
              instanceID: request.data.contentEditorInstanceId
            };

            background.activeWindows.push(activeWindow);
            background.activeContentEditorInstances.push(request.data.contentEditorInstanceId);
          });

          chrome.storage.sync.set({ contentEditorInstanceId: request.data.contentEditorInstanceId });
          chrome.storage.sync.set({ instanceHTML: request.data.instanceHTML });
          chrome.storage.sync.set({ image_gallery: request.data.image_gallery });
        });
      }
      else {
      }
    },
    insertToContentEditor: (request) => {
      chrome.tabs.sendMessage(background.currentTabID, request, function(){
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
    initEditor: (request) => {
    },
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