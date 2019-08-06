import { GenerateID, GenerateTabID } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate, AddSubContentBlockBtnTemplate } from '../utils/interfaceTemplates';
import { UserInterfaceSortable } from '../utils/sortableHandler';

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

  render(html,options) {
    const params = {
      id: this.id,
      type: this.name,
      controlsTemplate: '',
      draggableClass: options.draggableClass,
      componentTemplate: html === '' ? this.template() : html,
      addTemplate: AddContentBlockBtnTemplate(this.id)
    };

    return ContentBlockTemplate(params);
  }

  accordionSectionTemplate(accordionID) {
    const template = `
      <div class="sf-accordion-item">
        <div class="sf-accordion-toggle" id="pane-${accordionID}">
          <h4 class="sf-accordion-text">Accordion Display Text</h4>
          <i class="sf-accordion-icon"></i>	
        </div>
        <div class="sf-accordion-content">
          <div class="canvas-subcontainer" id="canvasSubContainer_${accordionID}"></div>
          ${AddSubContentBlockBtnTemplate(accordionID)}
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
      HTMLObject.querySelectorAll('.sf-accordion-toggle').forEach((toggle) => {
        const toggleID = toggle.id.split('pane-')[1];
        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${accordionID}`),
          contentDraggableClass: `.canvasDraggableSub_${accordionID}`
        });
      });
    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }
};