import { GenerateID, GenerateTabID, DataTemplate, ExtractSubnodes } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate, AddSubContentBlockBtnTemplate } from '../utils/interfaceTemplates';
import { UserInterfaceSortable } from '../utils/sortableHandler';
import { ComponentParser } from './componentHelpers';

export const TabsLabel = 'Tabs';

export const ParseHTML = {
  isTrue: (htmlNode) => {
    return htmlNode.classList.value.includes('sf-tabs') ? true : false;
  },
  parse: (htmlNode) => {
    const data = new DataTemplate();

    data.titleSelector = '.sf-tab-item-link';
    data.containerSelector = '.sf-tab-content';
    data.hasSubnodes = true;
    data.type = 'Tabs';
    data.html = htmlNode.outerHTML;

    data.sections = (() => {
      const sectionIDs = [];
      [...htmlNode.children].forEach(section => {
        if (section.classList.value !== 'sf-tabs-bar') {  
          sectionIDs.push({
            id: section.id,
            title: document.getElementById(`target_${section.id}`).innerText
          }); 
        }
      });
      return sectionIDs;
    })();

    return data;
  }
};

export default class Tabs {
  constructor() {
    this.id = GenerateID();
    this.cssClass = 'sf-tabs';
    this.tabNamePrefix = 'Tab ';
    this.tabsCountMin = 2;
    this.tabsCurrentCount = this.tabsCountMin;
    this.selectorDOMSections = '.sf-tab-content';
  }

  render(item, options) {
    const params = {
      id: this.id,
      type: 'Tabs',
      controlsTemplate: this.controlsTemplate(this.id),
      draggableClass: options.draggableClass,
      componentTemplate: this.template(item),
      addTemplate: item.nodeLevel === 'main' ? AddContentBlockBtnTemplate(this.id) : ''
    };

    return ContentBlockTemplate(params);
  }

  template(existingData) {    
    let navTabItems = ``, navTabSections = ``;
    const hasChildren = () => { return existingData !== null && existingData.hasOwnProperty('sections'); };
    const tabsCountMin = hasChildren() ? existingData.sections.length : this.tabsCountMin;

    for (let i = 0; i < tabsCountMin; i++) {      
      const
        tabID = hasChildren() ? existingData.sections[i].id : 'cid-' + GenerateTabID(),
        tabTitle = hasChildren() ? existingData.sections[i].title : `Tab ${i + 1}`;
      
      navTabItems += this.tabLinkTemplate(tabID, tabTitle, i + 1);
      navTabSections += this.tabBodyTemplate(tabID, i + 1);
    }

    const defaultTemplate = `${this.editComponentSectionTemplate()}<div class="sf-tabs">
      <div class="sf-tabs-bar"><ul class="sf-tab-nav">${navTabItems}</ul></div>${navTabSections}</div>`;

    return defaultTemplate;
  }

  controlsTemplate(componentID) {
    return `<button class="canvas-btn canvas-btn-xs" data-action="edit-component" data-target="${componentID}">Edit Tabs</button>`;
  }

  tabLinkTemplate(tabID, tabTitle, index) {
    const template = `
      <li class="sf-tab-item${ index === 1 ? ' active' : ''}">
        <span class="sf-tab-item-link" id="target_${tabID}">${tabTitle}</span>
      </li>`;
    return template;
  }

  tabBodyTemplate(tabID, index) {
    const template = `
    <div class="sf-tab-content${index === 1 ? ' in' : ''}" id="${tabID}">
      <div class="canvas-subcontainer" id="canvasSubContainer_${tabID}"></div>
      ${AddSubContentBlockBtnTemplate(tabID)}
    </div>`;
    return template;
  }

  editFieldTemplate(textContent, id) {
    return `<li><input id="editInput-${id}" type="text" class="canvas-form-control" value="${textContent == '' ? 'Tab Title' : textContent}"/>
              <button class="canvas-btn canvas-btn-xs" data-action="delete-tab-item" data-target="${id}">
                <i class="icon-delete"></i>
              </button>
            </li>`;
  }

  editComponentSectionTemplate() {
    return `<div class="canvas-content-edit-overlay" id="editFields-${this.id}" style="display: none;">
              <h4>Update Tabs</h4>
              <ol class="canvas-content-edit-list"></ol>
              <button class="canvas-btn canvas-btn-xs" data-action="add-tab-item" data-target="${this.id}">
                <i class="icon-plus">&#43;</i> New Tab Section
              </button>
            </div>`;
  }

  updateTabsList(editFields, tabLinkTemplateFxn, tabBodyTemplateFxn) {
    const
      tabsBody = editFields.nextElementSibling,
      tabsLinks = editFields.nextElementSibling.querySelector('.sf-tab-nav');

    editFields.querySelectorAll('input').forEach((input,index) => {
      const
        tabID = input.id.split('editInput-')[1],
        tabSection = document.getElementById(tabID),
        tabLink = document.getElementById(`target_${tabID}`);
      
      if (tabSection === null) {
        tabsLinks.insertAdjacentHTML('beforeend', tabLinkTemplateFxn(tabID, input.value,index + 1));
        tabsBody.insertAdjacentHTML('beforeend', tabBodyTemplateFxn(tabID), index + 1);

        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${tabID}`),
          contentDraggableClass: `.canvasDraggableSub_${tabID}`
        });
      }
      else {
        if (input.classList.value.includes('deselected')) {
          tabsBody.removeChild(tabSection);
          tabsLinks.removeChild(tabLink.parentElement);
        }
        else {
          if (tabLink.textContent !== input.value) {
            tabLink.textContent = input.value;
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
        tabsCurrentCount = this.tabsCurrentCount,
        tabsCountMin = this.tabsCountMin;

      const
        contentEditList = HTMLObject.querySelector('.canvas-content-edit-list'),
        editFieldTemplateFxn = this.editFieldTemplate,
        tabLinkTemplateFxn = this.tabLinkTemplate,
        tabBodyTemplateFxn = this.tabBodyTemplate,
        updateTabsListFxn = this.updateTabsList;

      function deleteTabItem() {
        const targetInput = document.getElementById(`editInput-${this.getAttribute('data-target')}`);

        if (!targetInput.classList.value.includes('deselected')) {
          targetInput.classList.add('deselected');
          tabsCurrentCount -= 1;
          this.classList.add('disabled');
          this.innerHTML = 'Undo';
        }
        else {
          targetInput.classList.remove('deselected');
          tabsCurrentCount += 1;
          this.classList.remove('disabled');
          this.innerHTML = '<i class="icon-delete"></i>';
        }

        setButtonStates(this);
      };

      function addTabItem() {
        tabsCurrentCount += 1;
        contentEditList.insertAdjacentHTML('beforeend', editFieldTemplateFxn('', `cid-${GenerateTabID()}`));
      }

      function setButtonStates(clickedBtn) {
        const deleteBtns = [...contentEditList.querySelectorAll('[data-action="delete-tab-item"]')];

        deleteBtns.forEach(btn => {
          btn.disabled = tabsCurrentCount > tabsCountMin
            ? false : (btn.classList.value.includes('disabled') ? false : true);
        });
      }

      const observer = new MutationObserver(mutations => {
        console.log(mutations);
        
        if (mutations.length !== 0 && mutations[0].addedNodes.length !== 0) {
          for (let index = 0; index < mutations.length; index++) {
            mutations[0].addedNodes.forEach(li => {
              li.querySelector('[data-action="delete-tab-item"]').onclick = deleteTabItem;
            });
          }
          setButtonStates();
        }
      });

      // Mutations`
      HTMLObject.querySelectorAll('.sf-tab-content').forEach((tab) => {
        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${tab.id}`),
          contentDraggableClass: `.canvasDraggableSub_${tab.id}`
        });
      });

      // Update Component      
      HTMLObject.querySelector('[data-action="edit-component"]').onclick = function (event) {
        editFields = document.getElementById(`editFields-${HTMLObject.id}`);
        isEditOpen = isEditOpen == false ? true : false;
        event.target.textContent = isEditOpen ? 'Update Tabs' : 'Edit Tabs';
        editFields.style.display = isEditOpen ? 'block' : 'none';

        if (isEditOpen) { // If Update field is active
          observer.observe(contentEditList, {
            attributes: false,
            subtree: false,
            childList: true,
          });

          document
            .getElementById(this.getAttribute('data-target'))
            .querySelectorAll('.sf-tab-item-link')
            .forEach((tabToggle) => {
              editFieldsInput += editFieldTemplateFxn(tabToggle.textContent, tabToggle.id.split('target_')[1]);
            });

          contentEditList.innerHTML = editFieldsInput;
          editFields.nextElementSibling.style.display = 'none';
          tabsCurrentCount = contentEditList.children.length;
        }
        else { // Goes back to Accordion List
          updateTabsListFxn(editFields, tabLinkTemplateFxn, tabBodyTemplateFxn);
          editFields.nextElementSibling.removeAttribute('style');
          observer.disconnect();
          editFieldsInput = '';
        }
      };

      // Add New Line - DOM Display Only
      HTMLObject.querySelector('[data-action="add-tab-item"]').onclick = addTabItem;

    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }
}