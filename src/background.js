// =================================================================================
// Background.js gets called first. It listens to all window instances and
// the tabs and popups created under each instance.
// =================================================================================
import { UrlContainsArticleEdit, RequestIsValid, SetPosition } from '/modules/utils/chromeExtensionUtils.js';

const background = {
  crxID: '',
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
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
      const method = request.method;
      const config = request.data;

      if (RequestIsValid(request)) background.methods[method](config);
    });

  },
  methods: {
    popup: (config) => {
      const ph = 700, pw = 1000;
      const closePopup = () => {};

      const px = SetPosition(config.dimensions.win_left, config.dimensions.win_width, pw);
      const py = SetPosition(config.dimensions.win_top, config.dimensions.win_height, ph);

      const popupWindowConfig = {
        url: 'index.html',
        type: 'popup',
        height: ph,
        width: pw,
        left: Math.round(px), 
        top: Math.round(py)
      }

      config.display ? chrome.windows.create(popupWindowConfig) : closePopup();
    }
  },
  run: function(){
    background.listeners();
  }
}

background.run();

