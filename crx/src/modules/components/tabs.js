import { GenerateID, GenerateTabID, GetClosestParent } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate, AddSubContentBlockBtnTemplate } from '../utils/interfaceTemplates';
import UserInterfaceBuilder from '../UserInterfaceBuilder';

export const TabsLabel = 'Tabs';

export function ParseHTML(str) {
  return str.includes('sf-tabs') ? 'Tabs' : '';
}

export default class Tabs {
  constructor() {
    this.id = GenerateID();
    this.cssClass = 'sf-tabs';
    this.tabNamePrefix = 'Tab ';
    this.tabCountMin = 5;
    this.tabCurrentCount = this.tabCountMin;    
  }

  render(html) {
    const toBeParsedHTML = typeof html === 'undefined' ? this.template() : html;
    const params = {
      id: this.id,
      type: this.name,
      controlsTemplate: '',
      draggableClass: 'canvasDraggableMain',
      componentTemplate: toBeParsedHTML,
      addTemplate: AddContentBlockBtnTemplate(this.id)
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
    <div class="sf-tab-content${isActive ? ' in' : ''} " id="tab-${tabID}">
      <div id="canvasSubContainer_${tabID}"></div>
      ${AddSubContentBlockBtnTemplate(tabID)}
    </div>`;
    return template;
  }

  template() {
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

  updateDOM(HTMLObject) {
    console.log(HTMLObject);
    
    try {
      // const snippetContainer = document.getElementById(`snippet-${HTMLObject.id}`);
      // snippetContainer.insertAdjacentHTML('beforeend', AddSubContentBlockBtnTemplate());
      
      // const addSubnodeBtn = HTMLObject.querySelector('[data-node-level="2"]');
      // addSubnodeBtn.addEventListener('click', (event) => {
      //   const
      //     targetElem = GetClosestParent(event.target,'.canvas-content-block').id,
      //     targetContainer = document.getElementById(targetElem).querySelector('.sf-tab-content.in');
      //   addSubnodeBtn.setAttribute('data-target', targetContainer.id);
      // });
    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }
}

// _bindEvtEditTabs: function () {
//   const snippetContainer = document.getElementById(this.getAttribute('data-target'));
//   if (!this.classList.contains('canvas-btn-primary')) {
//     this.textContent = 'Save';
//     this.classList.add('canvas-btn-primary');
//     editor.btnSave.disabled = true;
//     editor.btnPreview.disabled = true;
//     snippetContainer.querySelectorAll('.sf-tab-item-link').forEach((element, index) => {
//       element.contentEditable = true;
//       element.parentElement.classList.add('edit-mode');

//       if (index == 0) {
//         let t;
//         element.focus();

//         t = setTimeout(() => {
//           document.execCommand('selectAll', false, null);
//           clearTimeout(t);
//         }, 50);
//       }

//       if (element.parentElement.parentElement.children.length > 2) {
//         element.parentElement
//           .insertAdjacentHTML('afterbegin', '<button type="button" class="canvas-btn canvas-btn-delete"><span>×</span></button>');

//         element.parentElement.querySelector('.canvas-btn-delete').onclick = function () {
//           const
//             targetTabIdToBeDeleted = this.nextElementSibling.id.split('target_')[1],
//             tabLength = this.parentElement.parentElement.children.length,
//             prevSibling = this.parentElement.previousElementSibling;

//           document.getElementById(targetTabIdToBeDeleted).remove();

//           if (tabLength > 2) this.parentElement.remove();
//           if (tabLength == 3) {
//             document.querySelectorAll('.canvas-btn-delete').forEach(element => {
//               element.remove();
//             });
//           }
//           if (this.parentElement.classList.contains('active') &&
//             this.parentElement.nextElementSibling == null) prevSibling.querySelector('.sf-tab-item-link').click();

//           editor.updateData();
//         };
//       }
//     });
//   }
//   else {
//     this.textContent = 'Edit Tabs';
//     this.classList.remove('canvas-btn-primary');
//     editor.btnSave.disabled = false;
//     editor.btnPreview.disabled = false;
//     snippetContainer.querySelectorAll('.sf-tab-item-link').forEach((element, index) => {
//       element.contentEditable = false;
//       element.removeAttribute('contentEditable');
//       element.parentElement.classList.remove('edit-mode');

//       if (element.previousElementSibling !== null) element.previousElementSibling.remove();
//     });
//   }
// },