import './editor.scss';
import {
  GetClosestParent,
  GenerateID,
  NormaliseHTMLString,
} from './modules/utils/chromeExtensionUtils';
import { dataParser } from './modules/utils/dataParser';
import ContentBlocks from './modules/ContentBlocks';
import UserInterfaceBuilder from './modules/UserInterfaceBuilder';
import Sortable from '../node_modules/sortablejs/Sortable.min';

let base64map = {};

let editor = {
  crxID: '',
  contentEditorInstanceId: '',
  instanceHTML:     '',
  outputPane:       document.getElementById('outputContainer'),
  htmlSection:      document.getElementById('htmlOutputContainer'),
  sourceSection:    document.getElementById('viewSourcePreview'),
  btnPreview:       document.getElementById('btnPreview'),
  btnSave:          document.getElementById('btnSave'),
  btnClose:         document.getElementById('btnCloseOutputContainer'),
  btnThemeSelector: document.getElementById('btnThemeSelector'),
  toggleView:       document.getElementById('outputContainerToggleView'),
  forTab:           false,
  existing_data:    [],
  test_data:        [],
  html_data_json:   '',
  toolbox:          undefined,
  init: function() {
    try {
      window.chrome.storage.sync.get(['contentEditorInstanceId'], function(objLocalStorage) {
        editor.contentEditorInstanceId = objLocalStorage.contentEditorInstanceId;
        editor.btnSave.setAttribute('data-target', editor.contentEditorInstanceId);
        editor.crxID = window.chrome.runtime.id;
      });

      window.chrome.storage.sync.get(['instanceHTML'], function(objLocalStorage) {
        const ih = objLocalStorage.instanceHTML;
        console.log(ih);
        if (ih !== '' || typeof ih !== 'undefined') {
          editor.htmlSection.insertAdjacentHTML('afterbegin',ih);
          editor.existing_data = dataParser(editor.htmlSection.childNodes, { GenerateID, ContentBlocks });
          editor.start_app();
        }
      });
    } catch (e) {
      editor.existing_data = [];
      editor.existing_data = dataParser(editor.htmlSection.childNodes, { GenerateID, ContentBlocks });
      editor.start_app();
      console.log('Attempting to do a chrome api method. You are in stand-alone mode');
    }
  },
  start_app: function() {
    editor.build_ui();
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
  parse_existing_html: function (ih) {
    editor.outputPane.style.display = 'block';
    editor.htmlSection.innerHTML = ih;

    return dataParser(editor.htmlSection.childNodes, { GenerateID, ContentBlocks });
  },
  build_ui: function() {
    function replaceString(baseStr, strLookup, strReplacement) {
      return baseStr.replace(strLookup, strReplacement);
    }

    UserInterfaceBuilder.render('canvas', {
      data: editor.existing_data,
      trigger: 'auto',
      dependencies: [ContentBlocks, replaceString],
      callback: function() {
        UserInterfaceBuilder.render('toolbox', ContentBlocks.elems);

        let canvasContainer,
            canvasContentBlocks,
            btnsAddComponent,
            btnsRemoveComponent,
            btnsSelectComponent;

        // This is where we bind each element event listeners to display the toolbox
        btnsSelectComponent = document.querySelectorAll('[data-action="select-component"]');
        btnsSelectComponent.forEach((elem, index) => {
          elem.onclick = editor._bindEvtDisplayToolbox;
        });

        // This is where we bind each element event listeners to add components
        btnsAddComponent = document.querySelectorAll('[data-action="add-component"]');
        btnsAddComponent.forEach((elem, index) => {
          elem.onclick = editor._bindEvtAddComponent;
        });

        // This is where we bind each element event listeners to delete components
        btnsRemoveComponent = document.querySelectorAll('[data-action="remove-component"]');
        btnsRemoveComponent.forEach((elem, index) => {
          elem.onclick = editor._bindEvtRemoveComponent;
        });

        // Initialise edit events to our elements
        canvasContainer = document.getElementById('canvasContainer');
        canvasContentBlocks = canvasContainer.querySelectorAll('.canvas-content-block');

        if (canvasContentBlocks.length > 0) {
          canvasContentBlocks.forEach((elem, index) => {
            if (elem.getAttribute('data-content') !== 'empty') {
              const domID = elem.getAttribute('id');
              const targetComponentPointer = elem
                .querySelector('.canvas-content-snippet')
                .getAttribute('data-component-type');

              editor.handleEditEventsToDOM(domID, targetComponentPointer);
            }
          });
        }

        // Init toolbox menu actions
        document.addEventListener('click', function(event) {
          const parent = GetClosestParent(event.target, '.canvas-add-component');
          if (parent === null) {
            toolbox.classList.remove('in');
          }
        }, false);

        // Hide/show page controls
        editor.togglePageButtons();
      }
    });
  },
  _bindEvtDisplayToolbox: function() {
    const toolbox = document.getElementById('toolbox');
    toolbox.classList.remove('in');
    toolbox.style.display = 'block';

    this.parentElement.appendChild(toolbox);
    const toolboxWidth = toolbox.offsetWidth;
    const isAddingFromTab = this.parentElement.classList.contains('canvas-add-subcontent');

    toolbox.style.left = isAddingFromTab ? '0' : 'calc(50% - ' + (toolboxWidth / 2 + 4) + 'px)';
    toolbox.classList.contains('in') ? toolbox.classList.remove('in') : toolbox.classList.add('in');
    toolbox.focus();
  },
  _bindEvtAddComponent: function() {
    const
      domID = GenerateID(),
      targetComponentPointer = this.getAttribute('data-ui-label');
    
    if (editor.existing_data.length === 0) editor.existing_data.push({});

    UserInterfaceBuilder.render('content', {
      id: domID,
      type: targetComponentPointer,
      data: ContentBlocks.elems[targetComponentPointer],
      trigger: this,
      callback: function (displayToolboxButtons) {
        let removeBtn;
        editor.handleEditEventsToDOM(domID, targetComponentPointer);

        displayToolboxButtons.forEach(function(btn, index) {
          btn.onclick = editor._bindEvtDisplayToolbox;
        });

        removeBtn = document.querySelector('[data-action="remove-component"][data-target="' + domID + '"]');
        removeBtn.onclick = editor._bindEvtRemoveComponent;

        UserInterfaceBuilder.render('canvas', {
          data: editor.existing_data,
          dependencies: [],
          trigger: 'user'
        });

        editor.updateData();
        editor.togglePageButtons();
      }
    });
  },
  _bindEvtSelectionDropdown: function() {
    const
      selectedStyle = this.value,
      targetSnippetContainer = this.getAttribute('data-target'),
      blockquote = document.getElementById(targetSnippetContainer).firstElementChild;

    blockquote.className = 'blockquote';
    blockquote.classList.add('blockquote-' + selectedStyle);
  },
  _bindEvtHeaderInput: function() {
    if (this.textContent == '') this.textContent = 'Click here to edit heading';
  },
  _bindEvtRemoveComponent: function() {
    const
      id = this.getAttribute('data-target'),
      container = document.getElementById('canvasContainer'),
      targetElem = document.getElementById(id),
      toolbox = document.getElementById('toolbox');
    
    toolbox.classList.remove('in');
    toolbox.style.display = 'block';
    container.appendChild(toolbox);
    targetElem.remove();

    editor.updateData();

    if (editor.existing_data.length === 0) {
      UserInterfaceBuilder.render('canvas', {
        data: editor.existing_data,
        dependencies: [],
        trigger: 'user'
      });

      container.querySelector('[data-action="select-component"]').onclick = editor._bindEvtDisplayToolbox;
    }
  },
  togglePageButtons: function() {
    editor.btnPreview.style.display = editor.existing_data.length == 0 ? 'none' : 'initial';
    editor.btnSave.style.display = editor.existing_data.length == 0 ? 'none' : 'initial';
  },
  handleEditEventsToDOM: function(domID, targetComponentPointer) {
    let contentEditorContainerID;
    const targetSnippetContainer = document.getElementById('snippet-' + domID);
    const contentEditorBindToElem = ContentBlocks.elems[targetComponentPointer].contentEditorBindToElem;

    const attachAttributesForCKEDITOR = (id, headerClass, bodyClass) => {
      const targetContentHeading = document.querySelector('#snippet-' + id + ' .' + headerClass),
          targetContentBody = document.querySelector('#snippet-' + id + ' .' + bodyClass);

      targetContentHeading.contentEditable = true;
      targetContentBody.contentEditable = true;

      targetContentHeading.onblur = editor._bindEvtHeaderInput;
      targetContentBody.id = 'contentEditableBody-' + id;
    };

    if (targetComponentPointer == 'blockQuotes') {
      attachAttributesForCKEDITOR(domID, 'blockquote-content-header', 'blockquote-content-body', editor._bindEvtHeaderInput);
      document.querySelector('[data-target="snippet-' + domID + '"]').onchange = editor._bindEvtSelectionDropdown;
    }

    if (targetComponentPointer == 'wellContainer') {
      attachAttributesForCKEDITOR(domID, 'well-heading', 'well-body', editor._bindEvtHeaderInput);
    }

    if (targetComponentPointer == 'genericTabs') {
        const targetTabContent = targetSnippetContainer.querySelectorAll('.tab-content');
        targetTabContent.forEach(function(targtTab, y) {
          const targetTabID = targtTab.getAttribute('id');
          editor.init_sortable({
            container: document.getElementById(targetTabID),
            contentDraggableClass: '.canvasDraggableSub_' + targetTabID
          });
        });
    }

    if (targetComponentPointer == 'styledLists' || targetComponentPointer == 'textEditor') {
      targetSnippetContainer.contentEditable = true;
    }

    if (contentEditorBindToElem !== 'none') {
      const contentEditorContainerID = contentEditorBindToElem == 'content' ? 'contentEditableBody-' + domID : 'snippet-' + domID;
      editor.init_contentEditor({
        container: contentEditorContainerID,
        value: ContentBlocks.elems[targetComponentPointer].template(),
        config: ContentBlocks.elems[targetComponentPointer].contentEditorConfig
      });
    }
  },
  init_sortable: function(config) {
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
      direction: 'vertical',
      onUpdate: function () {
        editor.updateData();
        console.log('list updated');
      }
    };

    new Sortable(config.container, sortableConfig);
  },
  init_contentEditor: function(contentEditorAppConfig) {
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

      }; 
    }

    tinymce.init(tinymceConfig);
  },
  updateData: function () {
    let arr = [];

    const sanitizeContentBlock = contentBlock => {
      const clone = contentBlock.querySelector('.canvas-content-snippet').firstElementChild.cloneNode(true);
      clone.querySelectorAll('[contenteditable="true"]').forEach(function (element) {
        element.removeAttribute('id');
        element.removeAttribute('contentEditable');
        element.removeAttribute('style');
        element.removeAttribute('spellcheck');
        if (element.classList.contains('mce-content-body')) { element.classList.remove('mce-content-body'); }
      });

      return NormaliseHTMLString(clone.outerHTML);
    };

    const createMetadata = (componentType, contentBlock, contentHTML) => {
      if (ContentBlocks.elems[componentType].hasChildContent) {
        return { subnodes: [], html: NormaliseHTMLString(contentHTML) };
      }
      else {
        return { html: sanitizeContentBlock(contentBlock), variables: [] };        
      }
    };

    const sanitizeTabs = (tabs,content) => {
      const div = document.createElement('DIV');
      div.innerHTML = tabs;

      div.querySelectorAll('.tab-content').forEach(function (tab, index) {
        tab.innerHTML = typeof content[index] !== 'undefined' ? content[index] : '';
      });

      return div.innerHTML;
    };

    document.querySelectorAll('#canvasContainer > .canvas-content-block').forEach(function (element) {
      const type = element.querySelector('.canvas-content-snippet').getAttribute('data-component-type');
      const id = element.getAttribute('id');
      let data = { id: id, type: type, metadata: {} };

      data.metadata = createMetadata(type, element, element.querySelector('.canvas-content-snippet').innerHTML);

      if (ContentBlocks.elems[type].hasChildContent) {
        const tabLinks = element.querySelectorAll('.tab-item-link');

        let extractedElementsFromTabs = [];

        tabLinks.forEach(function (tabElement, tabIndex) {
          const 
            tabSection = document.getElementById(tabElement.getAttribute('id').split('target_')[1]),
            tabId = tabSection.getAttribute('id'),
            tabText = tabElement.textContent;

          data.metadata['subnodes'].push({ label: tabText, id: tabId, content: [] });

          if (tabSection.children.length > 0) {
            const subnodes = tabSection.querySelectorAll('.canvas-content-block');
            let sanitisedSNodeCollection = '';

            subnodes.forEach(function (subElement) {
              const 
                subnodeID = subElement.getAttribute('id'),
                subnodeType = document.getElementById('snippet-' + subnodeID).getAttribute('data-component-type'),
                sanitisedSNode = createMetadata(subnodeType, subElement, '');

              data.metadata.subnodes[tabIndex].content.push({
                id: subnodeID,
                type: subnodeType,
                metadata: sanitisedSNode
              });

              sanitisedSNodeCollection += sanitisedSNode.html;
            });

            extractedElementsFromTabs.push(sanitisedSNodeCollection);
          }
        });

        data.metadata.html = sanitizeTabs(data.metadata.html, extractedElementsFromTabs);
      }

      arr.push(data);
    });

    editor.existing_data = arr;
    console.log(editor.existing_data);
  },
  html_view: function() {
    const view = this.value;
    editor.sourceSection.style.display = view == 'source' ? 'block' : 'none';
    editor.htmlSection.style.display = view == 'html' ? 'block' : 'none';
  },
  close_preview: function() {
    editor.outputPane.style.display = 'none';
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

    editor.existing_data.forEach(function(elem){
      html += elem.metadata.html;
    });

    editor.htmlSection.innerHTML = editor.existing_data.length > 0 ? html : '<strong>Nothing to display here.</strong>';

    editor.htmlSection.querySelectorAll('img').forEach(function(elem){
      if (base64map.hasOwnProperty(elem.src)) {
        elem.src = base64map[elem.src];
      }
    });

    editor.sourceSection.value = editor.htmlSection.innerHTML;

    // Modify IDS just for preview
    editor.htmlSection.querySelectorAll('.tabs').forEach(function(elem, i){
      elem.querySelectorAll('.tab-item-link').forEach(function(tabLink,_i){
        const dataTarget = tabLink.getAttribute('id').split('target_')[1];
        tabLink.setAttribute('data-target', 'preview_' + dataTarget);
        elem.querySelector('#' + dataTarget).id = 'preview_' + dataTarget;
      });
    });
  },
  save_html: function() {
    editor.generate_html();
    editor.outputPane.style.display = 'none';

    const request = {
      method: 'insertToContentEditor',
      origin: window.location.origin,
      crxid: editor.crxID,
      data: {
        html: editor.sourceSection.value + editor.html_data_json,
        ckeditorIntanceId: this.getAttribute('data-target')
      }
    };

    try {
      window.chrome.runtime.sendMessage(editor.crxID, request);
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