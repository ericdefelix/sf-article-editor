import { GenerateID, GenerateTabID } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate, AddSubContentBlockBtnTemplate } from '../utils/interfaceTemplates';
import { UserInterfaceSortable } from '../utils/sortableHandler';

export const AccordionLabel = 'Accordion';

export function ParseHTML(str) {
  return str.includes('sf-accordion') ? 'Accordion' : '';
}

export function ParseChildrenHTML(parentComponent) {
  if (parentComponent.classList.value.includes('sf-accordion')) {
    const childrenNodes = [];
    parentComponent.querySelectorAll('.sf-accordion-content').forEach(node => {
      console.log(node.children);
      
    });
    return childrenNodes;
  }
  else {
    return null;
  }
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

  accordionSectionTemplate(accordionID, accordionTitle) {
    const template = `<div class="sf-accordion-item">
                        <div class="sf-accordion-toggle" id="pane-${accordionID}">
                          <h4 class="sf-accordion-text">${accordionTitle == '' ? 'Accordion Display Text' : accordionTitle }</h4>
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
    return `<li><input id="editInput-${id}" type="text" class="canvas-form-control" value="${textContent == '' ? 'Accordion Display Text' : textContent}"/>
              <button class="canvas-btn canvas-btn-xs" data-action="delete-accordion-item" data-target="${id}">
                <i class="icon-delete"></i>
              </button>
            </li>`;
  }

  editComponentSectionTemplate() {
    return `<div class="canvas-content-edit-overlay" id="editFields-${this.id}" style="display: none;">
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
      accordionSections += this.accordionSectionTemplate(accordionID, '');
    }
    return `${this.editComponentSectionTemplate()}<div class="sf-accordion">${accordionSections}</div>`;
  }

  updateAccordionList(editFields, accordionSectionTemplateFxn) {
    const accordionList = editFields.nextElementSibling;
    editFields.querySelectorAll('input').forEach((input) => {
      const
        toggleID = input.id.split('editInput-')[1],
        toggle = document.getElementById(toggleID);

      if (toggle === null) {
        accordionList.insertAdjacentHTML('beforeend', accordionSectionTemplateFxn(toggleID, input.value));
        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${toggleID}`),
          contentDraggableClass: `.canvasDraggableSub_${toggleID}`
        });
      }
      else {
        if (input.classList.value.includes('deselected')) {
          accordionList.removeChild(toggle.parentElement);
        }
        else {
          if (toggle.querySelector('.sf-accordion-text').textContent !== input.value) {
            toggle.querySelector('.sf-accordion-text').textContent = input.value;
          }
        }
      }
    });
  }

  updateDOM(HTMLObject) {
    try {
      let
        editFields,
        editFieldsInput = ``,
        isEditOpen = false,
        accordionCurrentCount = this.accordionCurrentCount,
        accordionCountMin = this.accordionCountMin;

      const
        contentEditList = HTMLObject.querySelector('.canvas-content-edit-list'),
        editFieldTemplateFxn = this.editFieldTemplate,
        accordionSectionTemplateFxn = this.accordionSectionTemplate,
        updateAccordionListFxn = this.updateAccordionList;
      
      function deleteAccordionItem(){
        const targetInput = document.getElementById(`editInput-${this.getAttribute('data-target')}`);

        if (!targetInput.classList.value.includes('deselected')) {
          targetInput.classList.add('deselected');
          accordionCurrentCount -= 1;
          this.classList.add('disabled');
          this.innerHTML = 'Undo';
        }
        else {
          targetInput.classList.remove('deselected');
          accordionCurrentCount += 1;
          this.classList.remove('disabled');
          this.innerHTML = '<i class="icon-delete"></i>';
        }

        setButtonStates(this);
      };

      function addAccordionItem() {
        const newBtnTabID = `pane-${GenerateTabID()}`;
        accordionCurrentCount += 1;
        console.log(accordionCurrentCount);
        contentEditList.insertAdjacentHTML('beforeend', editFieldTemplateFxn('', newBtnTabID));
      }

      function setButtonStates(clickedBtn) {
        const deleteBtns = [...contentEditList.querySelectorAll('[data-action="delete-accordion-item"]')];
        
        deleteBtns.forEach(btn => {          
          btn.disabled = accordionCurrentCount > accordionCountMin
            ? false : (btn.classList.value.includes('disabled') ? false : true);
        });
      }

      const observer = new MutationObserver(mutations => {
        if (mutations.length !== 0 && mutations[0].addedNodes.length !== 0) {
          for (let index = 0; index < mutations.length; index++) {
            mutations[0].addedNodes.forEach(li => {
              li.querySelector('[data-action="delete-accordion-item"]').onclick = deleteAccordionItem;
            });
          }
          setButtonStates();
        }
      });

      // Mutations`
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
        isEditOpen = isEditOpen == false ? true : false;
        event.target.textContent = isEditOpen ? 'Update Accordion' : 'Edit Accordion';
        editFields.style.display = isEditOpen ? 'block' : 'none';
        
        if (isEditOpen) { // If Update field is active
          observer.observe(contentEditList, {
            attributes: false,
            subtree: false,
            childList: true,
          });

          document
            .getElementById(this.getAttribute('data-target'))
            .querySelectorAll('.sf-accordion-toggle')
            .forEach((accordionToggle) => {
              const accordionTitle = accordionToggle.querySelector('.sf-accordion-text');
              editFieldsInput += editFieldTemplateFxn(accordionTitle.textContent, accordionToggle.id);
            });
          
          contentEditList.innerHTML = editFieldsInput;
          editFields.nextElementSibling.style.display = 'none';
          accordionCurrentCount = contentEditList.children.length;
        }
        else { // Goes back to Accordion List
          updateAccordionListFxn(editFields, accordionSectionTemplateFxn);
          editFields.nextElementSibling.removeAttribute('style');
          observer.disconnect();
          editFieldsInput = '';
        }
      };

      // Add New Line - DOM Display Only
      HTMLObject.querySelector('[data-action="add-accordion-item"]').onclick = addAccordionItem;

    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }
};