// =================================================================================
// Background.js gets called first. It listens to all window instances and
// the tabs and popups created under each instance.
// =================================================================================
import { UrlContainsArticleEdit, RequestIsValid, SetPosition } from '/modules/utils/chromeExtensionUtils.js';

const background = {
  crxID: '',
  currentTabID: '',
  requests: [],
  init: function() {
    chrome.windows.getCurrent({ populate: true },function(currentWindow){
      
    });
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
      const closePopup = () => {};

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

      console.log(editorDataFromWebpage);

      chrome.runtime.sendMessage(editorDataFromWebpage);
      data.display ? chrome.windows.create(popupWindowConfig) : closePopup();
    },
    insertToCKEDITOR: (request) => {
      chrome.tabs.sendMessage(background.currentTabID, request);
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

