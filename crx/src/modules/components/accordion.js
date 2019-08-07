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
      controlsTemplate: this.controlsTemplate(this.id),
      draggableClass: options.draggableClass,
      componentTemplate: html === '' ? this.template() : html,
      addTemplate: AddContentBlockBtnTemplate(this.id)
    };

    return ContentBlockTemplate(params);
  }

  controlsTemplate(componentID) {
    return `<button class="canvas-btn canvas-btn-xs" data-action="edit-component" data-target="${componentID}">Edit Accordion</button>`;
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

  editFieldTemplate(textContent, id) {
    return `
      <li><input id="editInput-${id}" type="text" class="canvas-form-control" value="${textContent == '' ? 'Accordion Display Text' : textContent}"/>
      <button class="canvas-btn canvas-btn-xs" data-action="delete-accordion-item" data-target="${id}">
        <i class="icon-delete"></i>
      </button></li>`;
  }

  editComponentSectionTemplate() {
    return `
      <div class="canvas-content-edit-overlay" id="editFields-${this.id}" style="display: none;">
        <h4>Update Accordion</h4>
        <ol class="canvas-content-edit-list"></ol>
        <button class="canvas-btn canvas-btn-xs" data-action="add-accordion-item" data-target="${this.id}">
          <i class="icon-plus">&#43;</i> New Accordion Section
        </button>
      </div>`;
  }

  template(existingHTML) {
    let accordionSections = ``;

    for (let i = 0; i < this.accordionCountMin; i++) {
      const accordionID = GenerateTabID();
      accordionSections += this.accordionSectionTemplate(accordionID);
    }
    return `${this.editComponentSectionTemplate()}<div class="sf-accordion">${accordionSections}</div>`;
  }

  updateDOM(HTMLObject) {
    try {
      const
        editFieldTemplateFxn = this.editFieldTemplate,
        accordionSectionTemplateFxn = this.accordionSectionTemplate,
        editFieldsIsHidden = () => {
          return editFields.style.display == 'none' ? true : false;
        };
      
      let editFields, editFieldsInput, accordionSections = [];

      HTMLObject.querySelectorAll('.sf-accordion-toggle').forEach((toggle) => {
        const toggleID = toggle.id.split('pane-')[1];
        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${toggleID}`),
          contentDraggableClass: `.canvasDraggableSub_${toggleID}`
        });
      });

      // Update Component
      HTMLObject.querySelector('[data-action="edit-component"]').onclick = function (event) {
        editFields = document.getElementById(`editFields-${HTMLObject.id}`);
        editFieldsInput = ``;
        
        event.target.textContent = editFieldsIsHidden() ? 'Update Accordion' : 'Edit Accordion';
        editFields.style.display = editFieldsIsHidden() ? 'block' : 'none';

        document
          .getElementById(this.getAttribute('data-target'))
          .querySelectorAll('.sf-accordion-toggle')
          .forEach((accordionToggle) => {
            const accordionTitle = accordionToggle.querySelector('.sf-accordion-text');
            if (!editFieldsIsHidden()) {
              editFieldsInput += editFieldTemplateFxn(accordionTitle.textContent, accordionToggle.id);
              accordionSections.push({ id: accordionToggle.id, text: accordionTitle.textContent, status: 1, });
            }
          });

        if (!editFieldsIsHidden()) {
          editFields.nextElementSibling.style.display = 'none';
          editFields.querySelector('.canvas-content-edit-list').innerHTML = editFieldsInput;
          editFields.querySelectorAll('[data-action="delete-accordion-item"]').forEach((btn) => {
            btn.onclick = function (event) {
              const targetInput = document.getElementById(`editInput-${this.getAttribute('data-target')}`);
              
              if (!targetInput.classList.value.includes('deselected')) {
                targetInput.classList.add('deselected');
                console.log('test');
                
              }
            };
          });
          console.log(accordionSections);
          
        }
        else {
          editFields.nextElementSibling.removeAttribute('style');
        }
      };

      // Add New Line - DOM Display Only
      HTMLObject.querySelector('[data-action="add-accordion-item"]').onclick = function (event) {
        HTMLObject.querySelector('.canvas-content-edit-list').insertAdjacentHTML('beforeend', editFieldTemplateFxn('', `pane-${GenerateTabID()}`));
      };

    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }
};