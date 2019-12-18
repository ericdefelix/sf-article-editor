import './editor.scss';
import UserInterfaceBuilder from './modules/UserInterfaceBuilder';
import ImageGallery from './modules/ImageGallery';
import { dataParser } from './modules/utils/dataParser';
import { GenerateSanitisedHTML } from './modules/utils/GenerateSanitisedHTML';
import { imageGalleryMockData, htmlMockData } from './modules/utils/mockData';
import storeMarkupErrors from './modules/utils/markupErrorLogger';

const editor = {
  crxID: '',
  contentEditorInstanceId: '',
  instanceHTML: '',
  canvasContainer: document.getElementById('canvasContainer'),
  outputPane: document.getElementById('outputContainer'),
  htmlSection: document.getElementById('htmlOutputContainer'),
  sourceSection: document.getElementById('viewSourcePreview'),
  btnPreview: document.getElementById('btnPreview'),
  btnSave: document.getElementById('btnSave'),
  btnClose: document.getElementById('btnCloseOutputContainer'),
  btnThemeSelector: document.getElementById('btnThemeSelector'),
  toggleView: document.getElementById('outputContainerToggleView'),
  existing_data: [],
  image_gallery: [],
  toolbox: undefined,
  init: () => {
    try {
      chrome.storage.local.get(['contentEditorInstanceId'], (objLocalStorage) => {
        editor.contentEditorInstanceId = objLocalStorage.contentEditorInstanceId;
        editor.btnSave.setAttribute('data-target', editor.contentEditorInstanceId);
        editor.crxID = chrome.runtime.id;
      });

      chrome.storage.local.get(['tab_id'], (objLocalStorage) => {
        editor.tabID = objLocalStorage.tab_id;
        editor.btnSave.setAttribute('data-tab-id', editor.tabID);
      });

      chrome.storage.local.get(['popup_id'], (objLocalStorage) => {
        editor.popupID = objLocalStorage.popup_id;
        editor.btnSave.setAttribute('data-popup-id', editor.popupID);
      });

      chrome.storage.local.get(['image_gallery'], (objLocalStorage) => {
        editor.image_gallery = JSON.parse(objLocalStorage.image_gallery);
        // ImageGallery.render(editor.image_gallery);
      });
      
      chrome.storage.local.get(['instanceHTML'], (objLocalStorage) => {
        const ih = objLocalStorage.instanceHTML;

        if (ih !== '' || typeof ih !== 'undefined') {
          storeMarkupErrors(ih, 'User Markup');
          editor.htmlSection.insertAdjacentHTML('afterbegin', ih);
          editor.existing_data = dataParser(editor.htmlSection);
          editor.htmlSection.innerHTML = '';
          editor.start_app();
        }
      });

      document.getElementById('versionNumber').innerText = 'v' + chrome.runtime.getManifest().version;

    } catch (e) {
      editor.image_gallery = imageGalleryMockData;
      editor.htmlSection.insertAdjacentHTML('afterbegin', htmlMockData);


      editor.existing_data = dataParser(editor.htmlSection);
      editor.htmlSection.innerHTML = '';

      editor.start_app();
      console.log('Chrome API not available. You are in stand-alone mode');
    }
  },
  start_app: () => {
    UserInterfaceBuilder.init(editor.canvasContainer, {
      data: editor.existing_data,
      images: editor.image_gallery
    });

    editor.btnPreview.onclick = editor.preview;
    editor.btnSave.onclick = editor.save_html;
    editor.toggleView.onchange = editor.html_view;
    editor.btnClose.onclick = editor.close_preview;
    editor.btnThemeSelector.onchange = editor.select_theme;
  },
  html_view: function () {
    const view = this.value;
    editor.sourceSection.style.display = view == 'source' ? 'block' : 'none';
    editor.htmlSection.style.display = view == 'html' ? 'block' : 'none';
  },
  close_preview: () => {
    editor.outputPane.style.display = 'none';
    document.querySelector('body').removeAttribute('style');
  },
  select_theme: function () {
    const themeValue = this.value;

    document.querySelector('body').classList.value = '';
    document.querySelector('body').classList.add('sf-' + themeValue);
  },
  preview: () => {
    storeMarkupErrors(editor.htmlSection.innerHTML, 'preview');
    GenerateSanitisedHTML(editor.canvasContainer, editor.htmlSection);
    editor.set_source();
    editor.handle_preview();
    editor.outputPane.style.display = 'block';
    document.querySelector('body').style.overflow = 'hidden';
  },
  set_source: () => {
    storeMarkupErrors(editor.htmlSection.innerHTML, 'set_source');
    let sourceString = editor.htmlSection.innerHTML.replace(/(\s{3,})|\n|\r|\t/g, '');
    sourceString = sourceString.replace(/sf-accordion-toggle in/g, 'sf-accordion-toggle');
    sourceString = sourceString.replace(/sf-tab-content in/g, 'sf-tab-content');
    sourceString = sourceString.replace(/sf-tab-item active/g, 'sf-tab-item');
    
    const div = document.createElement('DIV');
    div.innerHTML = sourceString;
    div.querySelectorAll('.sf-tabs').forEach(tabs => {
      tabs.querySelector('.sf-tab-nav > li').classList.add('active');
      tabs.querySelector('.sf-tab-content').classList.add('in');
    });
    sourceString = div.innerHTML;
    editor.sourceSection.value = sourceString;

    div.remove();
  },
  handle_preview: () => {
    if (editor.htmlSection.childNodes.length) {
      storeMarkupErrors(editor.htmlSection.innerHTML, 'Editor Save');
      editor.htmlSection.querySelectorAll('.sf-tab-item-link').forEach(link => {
        const targetLinkSectionID = link.id.split('target_')[1];
        link.id = link.id + 'preview';
        editor.htmlSection.querySelector(`#${targetLinkSectionID}`).id = editor.htmlSection.querySelector(`#${targetLinkSectionID}`).id + 'preview';
      });
    }
    else {
      return;
    }
  },
  save_html: function () {
    try {
      GenerateSanitisedHTML(editor.canvasContainer, editor.htmlSection);
      editor.set_source();
      storeMarkupErrors(editor.htmlSection, 'Editor Save');
      const request = {
        method: 'insertToContentEditor',
        origin: window.location.origin,
        crxid: editor.crxID,
        data: {
          html: editor.sourceSection.value,
          ckeditorIntanceId: this.getAttribute('data-target'),
          popupId: this.getAttribute('data-popup-id'),
          tabId: this.getAttribute('data-tab-id')
        }
      };

      editor.close_preview();
      chrome.runtime.sendMessage(editor.crxID, request);
    } catch (e) {
      console.log(e);
      console.log('Chrome API not available. Page origin is not via chrome extension');
    }
  },
  run: function () {
    this.init();
  }
};

editor.run();