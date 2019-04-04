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
  contentData: '',
  activeWindows: [],
  activeContentEditorInstances: [],
  requests: [],
  init: function () {
  },
  listeners: function () {
    chrome.runtime.requestUpdateCheck(function (data) {
      console.log(data);
    });

    chrome.runtime.onInstalled.addListener(function (details) {
      chrome.tabs.query({}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
          const tab = tabs[i];
          if (UrlContainsArticleEdit(tab.url)) {
            if (details.reason === 'install') {
              background.currentTabID = tab.id;
              chrome.tabs.update(tab.id, { highlighted: true });
              chrome.tabs.reload(tab.id);
            }
            if (details.reason == 'update') {
            }
            break;
          }
        }
      });
    });

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status == 'loading' && UrlContainsArticleEdit(tab.url) && background.currentTabID === '') {
        background.currentTabID = tab.id;
      }

      if (changeInfo.status == 'loading' && UrlContainsArticleEdit(tab.url) && background.currentTabID !== '') {
        chrome.tabs.executeScript(background.currentTabID, {
          file: 'index.js',
          runAt: 'document_end'
        });
      }
    });

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
          chrome.storage.sync.set({ image_gallery: request.data.image_gallery });
          chrome.storage.sync.set({ string_length: request.data.instanceHTML.length });

					do {
						var s = str.substring(0,20);
						arr.push(s);

						str = str.substr(20);
						if(str.length <= 20) arr.push(str);
					}
					while(str.length > 20);

        });
      }
      else {
      }
    },
    insertToContentEditor: (request) => {
      chrome.tabs.sendMessage(background.currentTabID, request, function () {
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