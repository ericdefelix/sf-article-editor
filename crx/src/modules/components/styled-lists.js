import { GenerateID, GenerateTabID, DataTemplate, ExtractSubnodes } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate, AddSubContentBlockBtnTemplate } from '../utils/interfaceTemplates';
import { UserInterfaceSortable } from '../utils/sortableHandler';
import { ComponentParser } from './componentHelpers';

export const StyledListsLabel = 'Numbering';

export const ParseHTML = {
  isTrue: (htmlNode) => {
    return htmlNode.classList.value.includes('sf-bullet-circular') ? true : false;
  },
  parse: (htmlNode) => {
    const data = new DataTemplate();

    data.subnodes = ExtractSubnodes({
      htmlNode: htmlNode,
      titleSelector: '',
      containerSelector: 'li'
    }, ComponentParser);

    document.querySelectorAll('li').forEach((bullet, index) => {
      data.subnodes.containers[index]['id'] = index;
    });

    data.hasSubnodes = true;
    data.type = 'Numbering';
    data.html = htmlNode.outerHTML;
    return data;
  }
};

export default class StyledLists {
  constructor() {
    this.id = GenerateID();
    this.cssClass = 'sf-list-bullet-circular';
    this.numberingCountMin = 2;
    this.numberingCurrentCount = this.numberingCountMin;
  }

  render(html, options) {
    const params = {
      id: this.id,
      type: 'Styled Lists',
      controlsTemplate: this.controlsTemplate(this.id),
      draggableClass: options.draggableClass,
      componentTemplate: this.template(html),
      addTemplate: AddContentBlockBtnTemplate(this.id)
    };

    return ContentBlockTemplate(params);
  }

  controlsTemplate(componentID) {
    return `<button class="canvas-btn canvas-btn-xs" data-action="edit-component" data-target="${componentID}">Edit Numbering</button>`;
  }

  numberingSectionTemplate(numberingID) {
    const template = `<li id="number-${numberingID}">
                        <div class="canvas-subcontainer" id="canvasSubContainer_${numberingID}"></div>${AddSubContentBlockBtnTemplate(numberingID)}
                      </li>`;
    return template;
  }

  editFieldTemplate(id) {
    return `<li><label>List Item</label>
              <button class="canvas-btn canvas-btn-xs" data-action="delete-list-item" data-target="${id}">
                <i class="icon-delete"></i>
              </button>
            </li>`;
  }

  editComponentSectionTemplate() {
    return `<div class="canvas-content-edit-overlay" id="editFields-${this.id}" style="display: none;">
              <h4>Update Numbered List</h4>
              <ol class="canvas-content-edit-list"></ol>
              <button class="canvas-btn canvas-btn-xs" data-action="add-list-item" data-target="${this.id}">
                <i class="icon-plus">&#43;</i> New Numbered List Item
              </button>
            </div>`;
  }

  template(existingData) {
    let numberingSections = ``;
    const numberingCountMin = typeof existingData === 'object' ? existingData.length : this.numberingCountMin;

    for (let i = 0; i < numberingCountMin; i++) {
      const numberingID = typeof existingData === 'object' ? existingData[i].id : GenerateTabID();
      numberingSections += this.numberingSectionTemplate(numberingID);
    }
    return `${this.editComponentSectionTemplate()}<ol class="${this.cssClass}">${numberingSections}</ol>`;
  }

  updateNumberingList(editFields, numberingSectionTemplateFxn) {
    const numberingList = editFields.nextElementSibling;
    editFields.querySelectorAll('input').forEach((input) => {
      const
        toggleID = input.id.split('editInput-')[1],
        toggle = document.getElementById(toggleID);

      if (toggle === null) {
        numberingList.insertAdjacentHTML('beforeend', numberingSectionTemplateFxn(toggleID, input.value));
        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${toggleID}`),
          contentDraggableClass: `.canvasDraggableSub_${toggleID}`
        });
      }
      else {
        if (input.classList.value.includes('deselected')) {
          numberingList.removeChild(toggle.parentElement);
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
        numberingCurrentCount = this.numberingCurrentCount,
        numberingCountMin = this.numberingCountMin;

      const
        contentEditList = HTMLObject.querySelector('.canvas-content-edit-list'),
        editFieldTemplateFxn = this.editFieldTemplate,
        numberingSectionTemplateFxn = this.numberingSectionTemplate,
        updateNumberingListFxn = this.updateNumberingList;

      function deleteNumberingItem() {
        const targetInput = document.getElementById(`editInput-${this.getAttribute('data-target')}`);

        if (!targetInput.classList.value.includes('deselected')) {
          targetInput.classList.add('deselected');
          numberingCurrentCount -= 1;
          this.classList.add('disabled');
          this.innerHTML = 'Undo';
        }
        else {
          targetInput.classList.remove('deselected');
          numberingCurrentCount += 1;
          this.classList.remove('disabled');
          this.innerHTML = '<i class="icon-delete"></i>';
        }

        setButtonStates(this);
      };

      function addNumberingItem() {
        const newBtnTabID = `pane-${GenerateTabID()}`;
        numberingCurrentCount += 1;
        contentEditList.insertAdjacentHTML('beforeend', editFieldTemplateFxn('', newBtnTabID));
      }

      function setButtonStates(clickedBtn) {
        const deleteBtns = [...contentEditList.querySelectorAll('[data-action="delete-list-item"]')];

        deleteBtns.forEach(btn => {
          btn.disabled = numberingCurrentCount > numberingCountMin
            ? false : (btn.classList.value.includes('disabled') ? false : true);
        });
      }

      const observer = new MutationObserver(mutations => {
        if (mutations.length !== 0 && mutations[0].addedNodes.length !== 0) {
          for (let index = 0; index < mutations.length; index++) {
            mutations[0].addedNodes.forEach(li => {
              li.querySelector('[data-action="delete-list-item"]').onclick = deleteNumberingItem;
            });
          }
          setButtonStates();
        }
      });

      // Mutations`
      HTMLObject.querySelectorAll('li').forEach((numberList) => {
        const numberListID = numberList.id.split('number-')[1];
        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${numberListID}`),
          contentDraggableClass: `.canvasDraggableSub_${numberListID}`
        });
      });

      // Update Component
      HTMLObject.querySelector('[data-action="edit-component"]').onclick = function (event) {
        editFields = document.getElementById(`editFields-${HTMLObject.id}`);
        isEditOpen = isEditOpen == false ? true : false;
        event.target.textContent = isEditOpen ? 'Update Numbered List' : 'Edit Numbered List';
        editFields.style.display = isEditOpen ? 'block' : 'none';

        if (isEditOpen) { // If Update field is active
          observer.observe(contentEditList, {
            attributes: false,
            subtree: false,
            childList: true,
          });

          contentEditList.innerHTML = editFieldsInput;
          editFields.nextElementSibling.style.display = 'none';
          numberingCurrentCount = contentEditList.children.length;
        }
        else { // Goes back to Accordion List
          updateNumberingListFxn(editFields, numberingSectionTemplateFxn);
          editFields.nextElementSibling.removeAttribute('style');
          observer.disconnect();
          editFieldsInput = '';
        }
      };

      // Add New Line - DOM Display Only
      HTMLObject.querySelector('[data-action="add-list-item"]').onclick = addNumberingItem;

    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }
};