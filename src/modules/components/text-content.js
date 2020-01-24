import {
  AddContentBlockBtnTemplate,
  ContentBlockTemplate
} from "../utils/interfaceTemplates";
import {
  DataTemplate,
  GenerateID,
  TinyMCEHelper
} from "../utils/chromeExtensionUtils";

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
      indentation: '15px',
      plugins: 'lists advlist link image table imagetools',
      toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist'
    };
  }

  render(item, options) {    
    const params = {
      id: this.id,
      type: 'Text Content',
      controlsTemplate: '',
      draggableClass: options.draggableClass,
      componentTemplate: !item.hasOwnProperty('html') ? this.template() : item.html,
      addTemplate: item.nodeLevel === 'main' ? AddContentBlockBtnTemplate(this.id) : ''
    };

    return ContentBlockTemplate(params);
  }

  template() {
    const defaultTemplate = `<div class="sf-editor-content"><p>Click to edit content</p></div>`;
    return defaultTemplate;
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
}