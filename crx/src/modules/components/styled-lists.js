import { GenerateID, TinyMCEHelper } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate } from '../utils/interfaceTemplates';

export const StyledListsLabel = 'Numbering';

export function ParseHTML(str) {
  return str.includes('sf-list-bullet-circular') ? 'StyledLists' : '';
}

export default class StyledLists {
  constructor() {
    this.id = GenerateID();
    this.name = this.name;
    this.cssClass = 'sf-list-bullet-circular';
    this.contentEditorConfig = {
      plugins: 'lists link image table imagetools',
      toolbar: 'undo redo | numlist bullist | link image imageupload table | bold italic strikethrough'
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
      const contentEditorAppConfig = {
        container: `#snippet-${HTMLObject.id}`,
        config: this.contentEditorConfig
      };

      tinymce.init(TinyMCEHelper(contentEditorAppConfig));
    } catch (error) {
      console.log('NO HTML Object to attached to');
    }
  }

  template() {
    const defaultTemplate = `
    <ol class="sf-list-bullet-circular">
      <li>Click here to start editing list</li>
      <li>Or paste content here.</li>
    </ol>`;

    return defaultTemplate;
  }
};