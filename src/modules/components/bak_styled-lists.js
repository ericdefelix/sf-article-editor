import { GenerateID, TinyMCEHelper, DataTemplate, GenerateTabID } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate, AddSubContentBlockBtnTemplate } from '../utils/interfaceTemplates';

export const StyledListsLabel = 'Numbering';

export const ParseHTML = {
  isTrue: (htmlNode) => {
    return htmlNode.classList.value.includes('sf-bullet-circular') ? true : false;
  },
  parse: (node) => {
    const data = new DataTemplate();
    data['type'] = 'StyledLists';
    data['html'] = node.outerHTML;
    return data;
  }
};

export default class StyledLists {
  constructor() {
    this.id = GenerateID();
    this.cssClass = 'sf-list-bullet-circular';
    this.contentEditorConfig = {
      plugins: 'lists link image table imagetools',
      toolbar: 'undo redo | numlist bullist | link image imageupload table | bold italic strikethrough'
    };
  }

  render(html, options) {
    const params = {
      id: this.id,
      type: 'Styled Lists',
      controlsTemplate: '',
      draggableClass: options.draggableClass,
      componentTemplate: html === '' ? this.template() : html,
      addTemplate: parseInt(options.nodeLevel) == 1 ? AddContentBlockBtnTemplate(this.id) : ''
    };

    return ContentBlockTemplate(params);
  }

  updateDOM(HTMLObject) {
    try {
      // const contentEditorAppConfig = {
      //   container: `#snippet-${HTMLObject.id}`,
      //   config: this.contentEditorConfig
      // };

      // const config = TinyMCEHelper(contentEditorAppConfig);
      // tinymce.init(config);
    } catch (error) {
      console.log('NO HTML Object to attached to');
    }
  }

  listItemTemplate(listID) {
    return `<li><div class="canvas-subcontainer" id="canvasSubContainer_${listID}"></div>${AddSubContentBlockBtnTemplate(listID)}</li>`;
  }

  template() {
    const listID = GenerateTabID();
    const defaultTemplate = `
    <ol class="sf-list-bullet-circular">${this.listItemTemplate(listID)}</ol>`;

    return defaultTemplate;
  }
};