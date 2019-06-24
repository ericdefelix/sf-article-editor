import {
  GenerateID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate,
  TinyMCEHelper
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
    const toBeParsedHTML = typeof html === 'undefined' ? this.template() : html;
    const params = {
      id: this.id,
      type: this.name,
      controlsTemplate: '',
      draggableClass: 'canvasDraggableMain',
      componentTemplate: toBeParsedHTML,
      addTemplate: AddContentBlockBtnTemplate(this.id)
    };

    return ContentBlockTemplate(params);
  }

  updateDOM(HTMLObject) {
    try {
      let
        contentEditorAppConfig,
        heading;

      contentEditorAppConfig = {
        container: `#snippet-${HTMLObject.id} .sf-well-body`,
        config: this.contentEditorConfig
      };

      tinymce.init(TinyMCEHelper(contentEditorAppConfig));

      heading = HTMLObject.querySelector('.sf-well-heading');
      heading.contentEditable = true;
      heading.onblur = this._bindEvtHeaderInput;
    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }

  _bindEvtHeaderInput() {
    if (this.textContent == '') this.textContent = 'Click to edit heading';
  }

  template() {
    const defaultTemplate = `
    <div class="sf-well"><h5 class="sf-well-heading">Click to edit heading</h5>
			<div class="sf-well-body">Click here to edit/paste content</div>
    </div>`;
  
    return defaultTemplate;
  }
};