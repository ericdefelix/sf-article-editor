import {
  GenerateID,
  GenerateTabID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate
} from '../utils/chromeExtensionUtils';

export const TabsLabel = 'Tabs';

export default class Tabs {
  constructor() {
    this.id = GenerateID();
    this.name = this.name;
    this.cssClass = 'sf-tabs';
    this.tabNamePrefix = 'Tab ';
    this.tabCountMin = 5;
    this.tabCurrentCount = this.tabCountMin;
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

  tabLinkTemplate(tabID, isActive, index) {
    const template = `
      <li class="sf-tab-item${ isActive ? ' active' : ''}">
        <span class="sf-tab-item-link" id="target_tab-${tabID}">${this.tabNamePrefix + (index + 1)}</span>
      </li>`;
    return template;
  }

  tabBodyTemplate(tabID, isActive) {
    const template = `
    <div class="sf-tab-content${isActive ? ' in' : ''}"
      id="tab-${ tabID }">
    </div>`;
    return template;
  }

  template(existingHTML) {
    let navTabItems = ``, navTabSections = ``;

    for (let i = 0; i < this.tabCountMin; i++) {
      const
        tabID = GenerateTabID(),
        isActive = i === 0 ? true : false;
      navTabItems += this.tabLinkTemplate(tabID, isActive, i);
      navTabSections += this.tabBodyTemplate(tabID, isActive);
    }

    const defaultTemplate = `
    <div class="sf-tabs">
      <div class="sf-tabs-bar"><ul class="sf-tab-nav">${navTabItems}</ul></div>
      ${navTabSections}
    </div>`;

    return defaultTemplate;
  }

  addTab() {

  }

  removeTab() {

  }
}