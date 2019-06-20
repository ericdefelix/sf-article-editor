import {
  GenerateID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate
} from '../utils/chromeExtensionUtils';

export const TextContentLabel = 'Text';

export default class TextContent {
  constructor() {
    this.id = GenerateID();
    this.type = this.name;
    this.cssClass = 'sf-editor-content';
    this.contentEditorConfig = {
      plugins: 'lists link image table imagetools',
      toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist'
    };
  }

  render(html) {
    const params = {
      id: this.id,
      controlsTemplate: '',
      draggableClass: 'canvasDraggableMain',
      componentTemplate: typeof html === 'undefined' ? this.template() : html,
      addTemplate: AddContentBlockBtnTemplate(this.id)
    };

    return ContentBlockTemplate(params);
  }

  template() {
    const defaultTemplate = `<div class="sf-editor-content"><p>Click to edit content</p></div>`;
    return defaultTemplate;
  }
}