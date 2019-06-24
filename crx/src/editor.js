import './editor.scss';
import { dataParser } from './modules/utils/dataParser';
import UserInterfaceBuilder from './modules/UserInterfaceBuilder';
import Sortable from '../node_modules/sortablejs/Sortable.min';
import { imageGalleryMockData, htmlMockData } from './modules/utils/mockData';


const editor = {
  crxID: '',
  contentEditorInstanceId: '',
  instanceHTML: '',
  canvasContainer:  document.getElementById('canvasContainer'),
  outputPane:       document.getElementById('outputContainer'),
  htmlSection:      document.getElementById('htmlOutputContainer'),
  sourceSection:    document.getElementById('viewSourcePreview'),
  btnPreview:       document.getElementById('btnPreview'),
  btnSave:          document.getElementById('btnSave'),
  btnClose:         document.getElementById('btnCloseOutputContainer'),
  btnThemeSelector: document.getElementById('btnThemeSelector'),
  toggleView:       document.getElementById('outputContainerToggleView'),
  existing_data:    [],
  image_gallery:    [],
  toolbox:          undefined,
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
        ImageGallery.run(editor.image_gallery); 
      });

      chrome.storage.local.get(['instanceHTML'], (objLocalStorage) => {
        const ih = objLocalStorage.instanceHTML;
        
        if (ih !== '' || typeof ih !== 'undefined') {
          editor.htmlSection.insertAdjacentHTML('afterbegin', ih);
          editor.existing_data = dataParser(editor.htmlSection.childNodes);
          editor.start_app();
        }
      });

      document.getElementById('versionNumber').innerText = 'v' + chrome.runtime.getManifest().version;

    } catch (e) {
      editor.image_gallery = imageGalleryMockData;
      editor.htmlSection.insertAdjacentHTML('afterbegin', htmlMockData);
      editor.existing_data = dataParser(editor.htmlSection.childNodes);
      console.log(editor.existing_data);
      
      editor.start_app();
      console.log('Attempting to do a chrome api method. You are in stand-alone mode');
    }
  },
  start_app: () => {
    UserInterfaceBuilder.init(editor.canvasContainer, {
      data: editor.existing_data
    });
  
    editor.init_sortable({
      container: document.getElementById('canvasContainer'),
      contentDraggableClass: '.canvasDraggableMain'
    });

    editor.btnPreview.onclick = editor.generate_html;
    editor.btnSave.onclick = editor.save_html;
    editor.toggleView.onchange = editor.html_view;
    editor.btnClose.onclick = editor.close_preview;
    editor.btnThemeSelector.onchange = editor.select_theme;
  },
  togglePageButtons: () => {
    editor.btnPreview.style.display = editor.existing_data.length == 0 ? 'none' : 'initial';
    editor.btnSave.style.display = editor.existing_data.length == 0 ? 'none' : 'initial';
  },
  init_sortable: (config) => {
    const sortableConfig = {
      sort: true,
      touchStartThreshold: 5,
      filter: '[data-content="empty"]',
      chosenClass: 'canvas-content-chosen',
      ghostClass: 'canvas-content-ghost',
      dragClass: 'canvas-content-dragging',
      animation: 300,
      easing: 'cubic-bezier(1, 0, 0, 1)',
      handle: config.contentDraggableClass,
      direction: 'vertical'
    };
    
    new Sortable(config.container, sortableConfig);
  },
  init_contentEditor: (contentEditorAppConfig) => {
    let tinymceConfig = {
      selector: '#' + contentEditorAppConfig.container,  // change this value according to your HTML
      inline: true,
      menubar: false,
      default_link_target: "_blank"
    };

    tinymceConfig['toolbar'] = contentEditorAppConfig.config.toolbar;
    tinymceConfig['plugins'] = contentEditorAppConfig.config.plugins;

    if (contentEditorAppConfig.config.toolbar.indexOf('image') !== -1) {
      tinymceConfig['image_title'] = true;
      tinymceConfig['automatic_uploads'] = true;
      tinymceConfig['paste_data_images '] = true;
      tinymceConfig['file_picker_types'] = 'image';
      tinymceConfig['file_picker_callback'] = function (cb, value, meta) {
        ImageGallery.run(editor.image_gallery);
      }; 
    }

    tinymce.init(tinymceConfig);
  },
  updateData: () => {

  },
  html_view: function() {
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
  generate_html: function() {
    editor.updateData();
    editor.outputPane.style.display = 'block';
    let html = '';

    editor.existing_data.forEach(function (elem) {
      html += elem.metadata.html;
    });

    editor.htmlSection.innerHTML = editor.existing_data.length > 0 ? html : '<strong>Nothing to display here.</strong>';

    // Always set first tab to be active on save
    editor.htmlSection.querySelectorAll('.sf-tab-nav').forEach(function (elem, i) {
      elem.firstElementChild.querySelector('.sf-tab-item-link').click();
    });

    editor.sourceSection.value = editor.htmlSection.innerHTML;

    // Modify IDS just for preview
    editor.htmlSection.querySelectorAll('.sf-tabs').forEach(function(elem, i){
      elem.querySelectorAll('.sf-tab-item-link').forEach(function(tabLink,_i){
        const dataTarget = tabLink.getAttribute('id').split('target_')[1];
        tabLink.setAttribute('id', 'target_preview_' + dataTarget);
        elem.querySelector('#' + dataTarget).id = 'preview_' + dataTarget;
      });
    });

    document.querySelector('body').style.overflow = 'hidden';
  },
  save_html: function() {
    editor.generate_html();

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

    try {
      editor.close_preview();
      chrome.runtime.sendMessage(editor.crxID, request);
    } catch (e) {
      // statements
      console.log('Attempting to do a chrome api method. Page origin is not via chrome extension');
    }
  },
  run: function() {
    this.init();
  }
};

editor.run();

  // handleEditEventsToDOM: (domID, targetComponentPointer) => {
  //   let contentEditorContainerID;
  //   const targetSnippetContainer = document.getElementById('snippet-' + domID);
  //   const contentEditorBindToElem = ContentBlocks.elems[targetComponentPointer].contentEditorBindToElem;

  //   const attachAttributesForCKEDITOR = (id, headerClass, bodyClass) => {
  //     const targetContentHeading = document.querySelector('#snippet-' + id + ' .' + headerClass),
  //         targetContentBody = document.querySelector('#snippet-' + id + ' .' + bodyClass);

  //     targetContentHeading.contentEditable = true;
  //     targetContentBody.contentEditable = true;

  //     targetContentHeading.onblur = editor._bindEvtHeaderInput;
  //     targetContentBody.id = 'contentEditableBody-' + id;
  //   };

  //   if (targetComponentPointer == 'blockQuotes') {
  //     attachAttributesForCKEDITOR(domID, 'sf-blockquote-content-header', 'sf-blockquote-content-body', editor._bindEvtHeaderInput);
  //     document.querySelector('[data-target="snippet-' + domID + '"]').onchange = editor._bindEvtSelectionDropdown;
  //   }

  //   if (targetComponentPointer == 'wellContainer') {
  //     attachAttributesForCKEDITOR(domID, 'sf-well-heading', 'sf-well-body', editor._bindEvtHeaderInput);
  //   }

  //   if (targetComponentPointer == 'genericTabs') {
  //     const targetTabContent = targetSnippetContainer.querySelectorAll('.sf-tab-content');

  //     targetTabContent.forEach(function(targtTab, y) {
  //       const targetTabID = targtTab.getAttribute('id');

  //       editor.init_sortable({
  //         container: document.getElementById(targetTabID),
  //         contentDraggableClass: '.canvasDraggableSub_' + targetTabID
  //       });
  //     });

  //     document.querySelector('[data-target="snippet-' + domID + '"]').onclick = editor._bindEvtEditTabs;
  //   }

  //   if (targetComponentPointer == 'styledLists' || targetComponentPointer == 'textEditor') {
  //     targetSnippetContainer.contentEditable = true;
  //   }

  //   if (contentEditorBindToElem !== 'none') {
  //     const contentEditorContainerID = contentEditorBindToElem == 'content' ? 'contentEditableBody-' + domID : 'snippet-' + domID;
  //     editor.init_contentEditor({
  //       container: contentEditorContainerID,
  //       value: ContentBlocks.elems[targetComponentPointer].template(),
  //       config: ContentBlocks.elems[targetComponentPointer].contentEditorConfig
  //     });
  //   }
  // },