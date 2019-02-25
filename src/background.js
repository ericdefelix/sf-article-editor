// =================================================================================
// Background.js gets called first. It listens to all window instances and
// the tabs and popups created under each instance.
// =================================================================================
import { UrlContainsArticleEdit, RequestIsValid, SetPosition } from '/modules/utils/chromeExtensionUtils.js';

function test() {
  console.log('test');
}

let background = {
  crxID: '',
  currentTabID: '',
  currentCkeditorInstance: '',
  activeWindows: [],
  activeCkeditorInstances: [],
  requests: [],
  init: function() {
  },
  listeners: function() {
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      if (changeInfo.status == 'loading' && UrlContainsArticleEdit(tab.url)) {
        chrome.tabs.executeScript({ 
          file: 'index.js',
          runAt: 'document_end'
        });
      }

      if (changeInfo.status == 'complete' && UrlContainsArticleEdit(tab.url)) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          background.currentTabID = tabs[0].id;
        });
      }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
      const method = request.method;
      if (RequestIsValid(request)) background.methods[method](request);
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
      }

      const editorDataFromWebpage = {
        method: 'initEditor',
        data: { 
          instanceHTML: data.instanceHTML,
          ckeditorInstanceId: data.ckeditorInstanceId
        }
      };

      chrome.runtime.sendMessage(editorDataFromWebpage);

      if (data.display) {
        chrome.windows.create(popupWindowConfig, function(win){
          chrome.windows.getCurrent({ populate: true },function(currentWindow){
            const activeWindow = {
              windowID: currentWindow.id,
              instanceID: request.data.ckeditorInstanceId
            };

            background.activeWindows.push(activeWindow);
            background.activeCkeditorInstances.push(request.data.ckeditorInstanceId);
          });

          console.log(chrome.storage);
          chrome.storage.sync.set({ ckeditorInstanceId: request.data.ckeditorInstanceId });
          chrome.storage.sync.set({ instanceHTML: request.data.instanceHTML });
        });
      }
      else {

      }
    },
    insertToCKEDITOR: (request) => {
      chrome.tabs.sendMessage(background.currentTabID, request);
    },
    initEditor: (request) => {
    },
    closePopups: (request) => {
      console.log(request);
      for (var i = 0; i <= background.activeWindows - 1; i++) {
        chrome.windows.remove(background.activeWindows[i].windowID);
      }
    }
  },
  run: function(){
    background.init();
    background.listeners();
  }
}

background.run();


// chrome.windows.getAll({ populate: true }, function(windowList){
//   console.log(windowList);
// });

