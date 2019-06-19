import {
  GenerateID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate
} from '../utils/chromeExtensionUtils';

export const TextContentLabel = 'Text';

export default class TextContent {
  constructor() {
    this.id = GenerateID();
    this.name = this.name;
    this.cssClass = 'sf-editor-content';
    this.contentEditorConfig = {
      plugins: 'lists link image table imagetools',
      toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist'
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
    let defaultTemplate = `<div class="sf-editor-content"><p>Click to edit content</p></div>`;

    return typeof existingHTML === 'undefined' ? defaultTemplate : existingHTML;
  }
}