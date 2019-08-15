import { GenerateID, TinyMCEHelper, DataTemplate } from '../utils/chromeExtensionUtils';
import {
  ContentBlockTemplate,
  AddContentBlockBtnTemplate
} from '../utils/interfaceTemplates';

export const TipsLabel = 'Tips';

export const ParseHTML = {
  isTrue: (htmlNode) => {
    return htmlNode.classList.value.includes('sf-blockquote') ? true : false;
  },
  parse: (node) => {
    const data = new DataTemplate();
    data['type'] = 'Tips';
    data['html'] = node.outerHTML;
    return data;
  }
};

export default class Tips {
  constructor() {
    this.id = GenerateID();
    this.cssClass = 'sf-blockquote';
    this.nodeObject = null;
    this.contentEditorConfig = {
      plugins: 'link image table',
      toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table',
    };
    this.types = {
      'info'  : 'Info',
      'tip'   : 'Tip',
      'alert' : 'Attention'
    };
  }

  renderControlsTemplate(toBeParsedHTML) {
    let template = '', classList = '';

    const temp = document.createElement('div');
    temp.innerHTML = toBeParsedHTML;
    classList = temp.firstElementChild.classList.value;
    temp.remove();

    for (const key in this.types) {
      template +=
        `<option value="${key}" 
          ${ classList.includes(`-${key}`)  ? ' selected' : ''}>
          ${this.types[key]}
        </option>`;
    }

    return `<select class="canvas-form-control" name="s-${this.id}" data-target="snippet-${this.id}">${template}</select>`;
  }

  render(html,options) {    
    const params = {
      id: this.id,
      type: this.constructor.name,
      controlsTemplate: this.renderControlsTemplate(html === '' ? this.template() : html),
      draggableClass: options.draggableClass,
      componentTemplate: html === '' ? this.template() : html,
      addTemplate: parseInt(options.nodeLevel) == 1 ? AddContentBlockBtnTemplate(this.id) : ''
    };

    return ContentBlockTemplate(params);
  }

  updateDOM(HTMLObject) {
    try {
      let
        contentEditorAppConfig,
        heading,
        typeSelector;
        
      contentEditorAppConfig = {
        container: `#snippet-${HTMLObject.id} .sf-blockquote-content-body`,
        config: this.contentEditorConfig
      };

      tinymce.init(TinyMCEHelper(contentEditorAppConfig));

      heading = HTMLObject.querySelector('.sf-blockquote-content-header');
      heading.contentEditable = true;
      heading.onblur = this._bindEvtHeaderInput;

      typeSelector = HTMLObject.querySelector(`select[data-target="snippet-${HTMLObject.id}"]`);
      typeSelector.onchange = this._bindEvtSelectionDropdown;

    } catch (error) {
      console.log(error);
      console.log('Update DOM is not defined properly');
    }
  }

  _bindEvtHeaderInput() {
    if (this.textContent == '') this.textContent = 'Click to edit heading';
  }

  _bindEvtSelectionDropdown() {
    const
      selectedStyle = this.value,
      targetComponent = document.getElementById(this.getAttribute('data-target')),
      tip = targetComponent.firstElementChild;

    tip.className = 'sf-blockquote';
    tip.classList.add('sf-blockquote-' + selectedStyle);
  }

  template() {
    const defaultTemplate = `
    <div class="sf-blockquote sf-blockquote-info" role="blockquote">
      <div class="sf-blockquote-addon"></div>
      <div class="sf-blockquote-content">
        <h5 class="sf-blockquote-content-header">Click to edit heading</h5>
        <div class="sf-blockquote-content-body">
          Click here to edit/paste content
        </div>
      </div>
    </div>`;

    return defaultTemplate;
  }
};