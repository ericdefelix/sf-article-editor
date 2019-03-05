import './editor.scss';
import {
  GetClosestParent,
  GenerateID,
  NormaliseHTMLString,
  DecodeHTMLString,
  EncodeHTMLString
} from './modules/utils/chromeExtensionUtils';
import ContentBlocks from './modules/ContentBlocks';
import UserInterfaceBuilder from './modules/UserInterfaceBuilder';
import Sortable from '../node_modules/sortablejs/Sortable.min';

let editor = {
  crxID: '',
  contentEditorInstanceId: '',
  instanceHTML: '',
  outputPane:       document.getElementById('outputContainer'),
  htmlSection:      document.getElementById('htmlOutputContainer'),
  sourceSection:    document.getElementById('viewSourcePreview'),
  btnPreview:       document.getElementById('btnPreview'),
  btnSave:          document.getElementById('btnSave'),
  btnClose:         document.getElementById('btnCloseOutputContainer'),
  toggleView:       document.getElementById('outputContainerToggleView'),
  existing_data:    [],
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
        if (ih !== '' || typeof ih !== 'undefined') {
          document
            .querySelector('body')
            .insertAdjacentHTML('beforeend','<div id="placeholderHTML" style="display: none;">'+ objLocalStorage.instanceHTML +'</div>');

          const pre = document.getElementById('placeholderHTML').querySelector('pre');

          editor.existing_data = pre !== null ? JSON.parse(DecodeHTMLString(pre.textContent)) : [];

          editor.start_app();
          console.log(editor.existing_data);
        }
      });
    } catch (e) {
      editor.existing_data = [];
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
    const domID = GenerateID();
    const targetComponentPointer = this.getAttribute('data-ui-label');

    let contentData = {}; // Internal data placeholder
    let removeBtn;

    UserInterfaceBuilder.render('content', {
      id: domID,
      type: targetComponentPointer,
      data: ContentBlocks.elems[targetComponentPointer],
      trigger: this,
      callback: function(displayToolboxButtons) {
        editor.handleEditEventsToDOM(domID, targetComponentPointer);

        displayToolboxButtons.forEach(function(btn, index) {
          btn.onclick = editor._bindEvtDisplayToolbox;
        });

        removeBtn = document.querySelector('[data-action="remove-component"][data-target="' + domID + '"]');
        removeBtn.onclick = editor._bindEvtRemoveComponent;

        // Internal data placeholder
        contentData['id'] = domID;
        contentData['type'] = targetComponentPointer;

        editor.existing_data.push(contentData);
      }
    });

    UserInterfaceBuilder.render('canvas', {
      data: editor.existing_data,
      dependencies: [],
      trigger: 'user'
    });

    editor.togglePageButtons();
  },
  _bindEvtSelectionDropdown: function() {
    const selectedStyle = this.value;
    const targetSnippetContainer = this.getAttribute('data-target');
    const blockquote = document.getElementById(targetSnippetContainer).firstElementChild;

    blockquote.className = 'blockquote';
    blockquote.classList.add('blockquote-' + selectedStyle);
  },
  _bindEvtHeaderInput: function() {
    if (this.textContent == '') this.textContent = 'Click here to edit heading';
  },
  _bindEvtRemoveComponent: function() {
    const id = this.getAttribute('data-target'),
      type = this.getAttribute('data-target-type'),
      container = document.getElementById('canvasContainer'),
      targetElem = document.getElementById(id);

    for (let i = 0; i <= editor.existing_data.length - 1; i++) {
      if (editor.existing_data[i].id === id) {
        editor.existing_data.splice(i, 1);
        break;
      }
    }

    const toolbox = document.getElementById('toolbox');
    toolbox.classList.remove('in');
    toolbox.style.display = 'block';

    container.appendChild(toolbox);
    targetElem.remove();
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
      editor.init_ckeditor({
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
      onEnd: editor.update_list
    };

    new Sortable(config.container, sortableConfig);
  },
  init_ckeditor: function(contentEditorAppConfig) {
    // console.log(contentEditorAppConfig);
    let tinymceConfig = {
      selector: '#' + contentEditorAppConfig.container,  // change this value according to your HTML
      inline: true,
      menubar: false,
      default_link_target: "_blank"
    };

    tinymceConfig['toolbar'] = contentEditorAppConfig.config.toolbar;
    tinymceConfig['plugins'] = contentEditorAppConfig.config.plugins;

    tinymce.init(tinymceConfig);
  },
  html_view: function() {
    const view = this.value;
    editor.sourceSection.style.display = view == 'source' ? 'block' : 'none';
    editor.htmlSection.style.display = view == 'html' ? 'block' : 'none';
  },
  close_preview: function() {
    editor.outputPane.style.display = 'none';
  },
  generate_html: function() {
    editor.outputPane.style.display = 'block';

    let contentBlocksDom,
      hiddenData,
      contentEditables,
      htmlOutputString = '',
      htmlData = [];

    const createMetadata = (componentType, htmlOutputString, elemChild) => {
      if (componentType == 'genericTabs') {
        return { subnodes: [], html: '' };
      } 
      else {
        if (componentType == 'wellContainer' || componentType == 'blockQuotes') {
          const heading = NormaliseHTMLString(elemChild.querySelector('h5').textContent);
          const body = NormaliseHTMLString(elemChild.querySelector('.mce-content-body').innerHTML);
          return { html: htmlOutputString, variables: [heading, body] };
        } 
        else {
          return { html: htmlOutputString };
        }
      }
    };

    const extractHTMLFromContentEditor = (elemChild) => {
      let contentEditableBodySnippetHTML;
      const clone = elemChild.cloneNode(true),
        contentEditableBodySnippet = clone.querySelector('.mce-content-body'),
        contentEditableBodySnippetClassName = contentEditableBodySnippet.classList[0],
        contentEditableBodySnippetData = extractHTML(contentEditableBodySnippet);

      contentEditableBodySnippet.remove();
      contentEditableBodySnippetHTML = `<div class="${contentEditableBodySnippetClassName}">${contentEditableBodySnippetData}</div>`;
      clone.lastElementChild.insertAdjacentHTML('beforeend', contentEditableBodySnippetHTML);
      return clone.outerHTML;
    };

    const extractHTML = (snippet) => {
      if (snippet.classList.contains('mce-content-body')) {
        const contentEditorInstance = snippet.getAttribute('id');
        return document.getElementById(contentEditorInstance).innerHTML;
      } 
      else {
        return snippet.innerHTML;
      }
    };

    if (editor.existing_data.length > 0) {
      contentBlocksDom = document.querySelectorAll('#canvasContainer > .canvas-content-block');
      contentBlocksDom.forEach((block, b_index) => {
        const snippet = block.querySelector('.canvas-content-snippet'),
          type = snippet.getAttribute('data-component-type'),
          id = block.getAttribute('id'),
          elemChild = snippet.firstElementChild;

        let metadata = {};

        const newContentObj = (type, id, data) => {
          return { type: type, id: id, metadata: data };
        };

        const newTabObj = (label, id) => {
          return { label: label, id: id, content: [] };
        };

        if (elemChild.classList.contains('tabs')) {
          let tabsContent;
          let tabsHTML = `<div class="tabs">`;

          tabsHTML += snippet.firstElementChild.firstElementChild.innerHTML;

          // Get data from tabs
          metadata = createMetadata(type, elemChild);
          htmlData.push(newContentObj(type, id, metadata));

          tabsContent = elemChild.querySelectorAll('.tab-content');
          tabsContent.forEach((tabcontent, tc_index) => {
            let tabContentBlocksHTML = ``;
            const tabContentBlocks = tabcontent.querySelectorAll('.canvas-content-block'),
                tabSnippets = tabcontent.querySelectorAll('.canvas-content-block .canvas-content-snippet'),
                tabId = tabcontent.getAttribute('id').split('tab-')[1],
                tabLabel = document.querySelector('.tab-item-link[data-target="tab-' + tabId + '"]').textContent;

              htmlData[b_index].metadata.subnodes.push(newTabObj(tabLabel, tabId));

              tabSnippets.forEach((tabSnippet, ts_index) => {
              const elemSubChild = tabSnippet.firstElementChild,
                  subchildType = tabSnippet.getAttribute('data-component-type'),
                  subchildID = tabContentBlocks[ts_index].getAttribute('id');

              const _tabContentBlocksHTML = (elemSubChild.classList.contains('blockquote') || elemSubChild.classList.contains('well')) ?
                  extractHTMLFromContentEditor(elemSubChild) : extractHTML(tabSnippet);

              const submetadata = createMetadata(subchildType, _tabContentBlocksHTML, elemSubChild);

              htmlData[b_index].metadata.subnodes[tc_index].content.push(newContentObj(subchildType, subchildID, submetadata));

              tabContentBlocksHTML += _tabContentBlocksHTML;
            });
            tabsHTML += `<section class="${tabcontent.className}" id="${tabcontent.id}">${tabContentBlocksHTML}</section>`;
          });

          htmlData[b_index].metadata.html = tabsHTML;
          htmlOutputString += tabsHTML + `</div>`;
        } 
        else {
          let _htmlOutputString;

          // Get data if an element has a heading and a body
          if (elemChild.classList.contains('blockquote') ||
            elemChild.classList.contains('well')) {
            const _heading = NormaliseHTMLString(elemChild.querySelector('h5').textContent),
              _body = NormaliseHTMLString(elemChild.querySelector('.mce-content-body').innerHTML);

            _htmlOutputString = NormaliseHTMLString(extractHTMLFromContentEditor(elemChild));
            metadata = createMetadata(type, _htmlOutputString, elemChild);
            htmlOutputString += _htmlOutputString;
          }
          // Get data if an element has no heading
          else {
            _htmlOutputString = NormaliseHTMLString(extractHTML(snippet));
            metadata = createMetadata(type, _htmlOutputString);
            htmlOutputString += _htmlOutputString;
          }

          htmlData.push(newContentObj(type, id, metadata));
        }
      });
    }

    hiddenData = htmlData.length > 0 ? `<pre style="display: none; position: absolute;">${ EncodeHTMLString(JSON.stringify(htmlData))}</pre>` : ``;

    editor.htmlSection.innerHTML = editor.existing_data.length > 0 ? htmlOutputString : '<strong>Nothing to display here.</strong>';
    editor.sourceSection.value = editor.htmlSection.innerHTML;
    editor.html_data_json = hiddenData;

    contentEditables = document.querySelectorAll('#outputContainer *[contenteditable="true"]');
    contentEditables.forEach((heading, h_index) => {
      heading.removeAttribute('contenteditable');
    });

    console.log(editor.html_data_json);
    console.log(htmlData);
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