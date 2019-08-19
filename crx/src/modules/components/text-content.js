import { GenerateID, TinyMCEHelper, DataTemplate } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate } from '../utils/interfaceTemplates';

export const TextContentLabel = 'Text';

export const ParseHTML = {
  isTrue: (htmlNode) => {
    return htmlNode.classList.value.includes('sf-editor-content') ? true : false;
  },
  parse: (node) => {
    const data = new DataTemplate();
    data['type'] = 'TextContent';
    data['html'] = node.outerHTML;
    return data;
  }
};

export default class TextContent {
  constructor() {
    this.id = GenerateID();
    this.cssClass = 'sf-editor-content';
    this.contentEditorConfig = {
      plugins: 'lists link image table imagetools',
      toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist'
    };
  }

  render(html, options) {
    const params = {
      id: this.id,
      type: 'Text Content',
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

      const config = TinyMCEHelper(contentEditorAppConfig);

      tinymce.init(config);
    } catch (error) {
      console.log('Update DOM is not defined properly');
    }
  }

  template() {
    const defaultTemplate = `<div class="sf-editor-content"><p>Click to edit content</p></div>`;
    return defaultTemplate;
  }
}