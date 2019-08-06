import { GenerateID, TinyMCEHelper } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate } from '../utils/interfaceTemplates';

export const TextContentLabel = 'Text';

export function ParseHTML(str) {
  return str.includes('sf-editor-content') ? 'TextContent' : '';
}

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

  render(html, options) {
    const params = {
      id: this.id,
      controlsTemplate: '',
      draggableClass: options.draggableClass,
      componentTemplate: html === '' ? this.template() : html,
      addTemplate: parseInt(options.nodeLevel) == 1 ? AddContentBlockBtnTemplate(this.id) : ''
    };

    return ContentBlockTemplate(params);
  }

  updateDOM(HTMLObject) {
    try {
      const contentEditorAppConfig = {
        container: `#snippet-${HTMLObject.id}`,
        config: this.contentEditorConfig
      };
      
      tinymce.init(TinyMCEHelper(contentEditorAppConfig));
    } catch (error) {
      console.log('Update DOM is not defined properly');
    }
  }

  template() {
    const defaultTemplate = `<div class="sf-editor-content"><p>Click to edit content</p></div>`;
    return defaultTemplate;
  }
}