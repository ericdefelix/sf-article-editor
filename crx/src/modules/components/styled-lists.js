import {
  GenerateID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate
} from '../utils/chromeExtensionUtils';

export const StyledListsLabel = 'Numbering';

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
    <ol class="sf-list-bullet-circular">
      <li>Click here to start editing list</li>
      <li>Or paste content here.</li>
    </ol>`;

    return typeof existingHTML === 'undefined' ? defaultTemplate : existingHTML;
  }
};