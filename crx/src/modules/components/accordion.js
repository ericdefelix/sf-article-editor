import {
  GenerateID,
  GenerateTabID,
  ContentBlockTemplate,
  AddContentBlockBtnTemplate
} from '../utils/chromeExtensionUtils';

export const AccordionLabel = 'Accordion';

export function ParseHTML(str) {
  return str.includes('sf-accordion') ? 'Accordion' : '';
}

export default class Accordion {
  constructor() {
    this.id = GenerateID();
    this.name = this.name;
    this.cssClass = 'sf-accordion';
    this.accordionNamePrefix = 'Accordion Pane ';
    this.accordionCountMin = 3;
    this.accordionCurrentCount = this.accordionCountMin;
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

  accordionSectionTemplate(accordionID) {
    const template = `
      <div class="sf-accordion-item">
        <div class="sf-accordion-toggle">
          <h4 class="sf-accordion-text">Accordion Display Text
            <br>
            <small>Subheading goes here</small>
          </h4>
          <i class="sf-accordion-icon"></i>	
        </div>
        <div class="sf-accordion-content">
          content
        </div>
      </div>`;
    return template;
  }

  template(existingHTML) {
    let accordionSections = ``;

    for (let i = 0; i < this.accordionCountMin - 1; i++) {
      const accordionID = GenerateTabID();
      accordionSections += this.accordionSectionTemplate(accordionID);
    }

    const defaultTemplate = `<div class="sf-accordion">${accordionSections}</div>`;
    
    return defaultTemplate;
  }

  addAccordion() {

  }

  removeAccordion() {

  }

  updateDOM(HTMLObject) {

    try {
      console.log(HTMLObject);

    } catch (error) {
      console.log('NO HTML Object to attached to');

    }
  }
};