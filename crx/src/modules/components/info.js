import {
  GenerateID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate,
} from '../utils/chromeExtensionUtils';

export const InfoLabel = 'Info';

export function ParseHTML(str) {
  return str.includes('sf-info') ? 'Info' : '';
}
export default class Info {
  constructor() {
    this.id = GenerateID();
    this.name = this.name;
    this.cssClass = 'sf-well';
    this.contentEditorConfig = {
      plugins: 'link image table',
      toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table'
    };
  }

  render(html) {
    const params = {
      id: this.id,
      type: this.name,
      controlsTemplate: '',
      draggableClass: 'canvasDraggableMain',
      componentTemplate: this.template(html),
      addTemplate: AddContentBlockBtnTemplate()
    };

    return ContentBlockTemplate(params);
  }

  template(existingHTML) {
    let defaultTemplate = `
    <div class="sf-well"><h5 class="sf-well-heading">Click here to edit heading</h5>
			<div class="sf-well-body">Click here to edit/paste content</div>
    </div>`;
  
    return typeof existingHTML === 'undefined' ? defaultTemplate : existingHTML;
  }

  updateDOM(HTMLObject) {
    try {

      console.log(HTMLObject);

    } catch (error) {
      console.log('NO HTML Object to attached to');

    }
  }
};

// _bindEvtHeaderInput: function() {
//   if (this.textContent == '') this.textContent = 'Click here to edit heading';
// },