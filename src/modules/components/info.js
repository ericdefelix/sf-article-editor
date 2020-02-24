import {
  AddContentBlockBtnTemplate,
  ContentBlockTemplate
} from '../utils/interfaceTemplates';
import {
  DataTemplate,
  GenerateID,
  TinyMCEHelper
} from '../utils/chromeExtensionUtils';

export const InfoLabel = 'Info';

export const ParseHTML = {
  isTrue: (htmlNode) => {    
    return htmlNode.classList.value.includes('sf-well') ? true : false;
  },
  parse: (node) => {
    const data = new DataTemplate();
    data['type'] = 'Info';
    data['html'] = node.outerHTML;
    return data;
  }
};

export default class Info {
  constructor() {
    this.id = GenerateID();
    this.cssClass = 'sf-well';
    this.contentEditorConfig = {
      plugins: 'link image table',
      toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | link image table'
    };
  }

  render(item, options) {    
    const params = {
      id: this.id,
      type: 'Info',
      controlsTemplate: '',
      draggableClass: options.draggableClass,
      componentTemplate: !item.hasOwnProperty('html') ? this.template() : item.html,
      addTemplate: item.nodeLevel === 'main' ? AddContentBlockBtnTemplate(this.id) : ''
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

      const config = TinyMCEHelper(contentEditorAppConfig);
      tinymce.init(config);

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