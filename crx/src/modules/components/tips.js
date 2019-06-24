import {
  GenerateID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate
} from '../utils/chromeExtensionUtils';

export const TipsLabel = 'Tips';

export function ParseHTML(str) {
  return str.includes('sf-blockquote') ? 'Tips' : '';
}

export default class Tips {
  constructor() {
    this.id = GenerateID();
    this.name = this.name;
    this.cssClass = 'sf-blockquote';
    this.nodeObject = null;
    this.selectedType = null;
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

  render(html) {
    const params = {
      id: this.id,
      type: this.name,
      controlsTemplate: this.renderControlsTemplate(),
      draggableClass: 'canvasDraggableMain',
      componentTemplate: this.template(html),
      addTemplate: AddContentBlockBtnTemplate()
    };

    return ContentBlockTemplate(params);
  }

  renderControlsTemplate(selectedValue) {
    let template = '';
    for (const key in this.types) {
      template +=
        `<option value="${ key }" 
          ${ typeof selectedValue !== 'undefined' && selectedValue === key ? ' selected' : ''}>
          ${this.types[key]}
        </option>`;
    }

    return `<select class="canvas-form-control" name="s-${this.id}" data-target="snippet-${this.id}">${template}</select>`;
  }

  template(existingHTML) {
    let defaultTemplate = `
    <div class="sf-blockquote sf-blockquote-info" role="blockquote">
      <div class="sf-blockquote-addon"></div>
      <div class="sf-blockquote-content">
        <h5 class="sf-blockquote-content-header">Click here to edit heading</h5>
        <div class="sf-blockquote-content-body">
          Click here to edit/paste content
        </div>
      </div>
    </div>`;

    return typeof existingHTML === 'undefined' ? defaultTemplate : existingHTML;
  }

  parse() {

  }

  updateDOM(HTMLObject) {

    try {
      // console.log(HTMLObject);

    } catch (error) {
      console.log('NO HTML Object to attached to');

    }
  }
};

// _bindEvtSelectionDropdown: function() {
//   const
//     selectedStyle = this.value,
//     targetSnippetContainer = this.getAttribute('data-target'),
//     blockquote = document.getElementById(targetSnippetContainer).firstElementChild;

//   blockquote.className = 'sf-blockquote';
//   blockquote.classList.add('sf-blockquote-' + selectedStyle);
// },

// _bindEvtHeaderInput: function() {
//   if (this.textContent == '') this.textContent = 'Click here to edit heading';
// },