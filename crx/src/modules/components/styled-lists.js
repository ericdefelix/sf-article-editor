import { GenerateID, GenerateTabID, DataTemplate, ExtractSubnodes } from '../utils/chromeExtensionUtils';
import { ContentBlockTemplate, AddContentBlockBtnTemplate, AddDeleteSubContentBlockBtnTemplate } from '../utils/interfaceTemplates';
import { UserInterfaceSortable } from '../utils/sortableHandler';
import { ComponentParser } from './componentHelpers';

export const StyledListsLabel = 'Numbering';

export const ParseHTML = {
  isTrue: (htmlNode) => {
    return htmlNode.classList.value.includes('sf-list-bullet-circular') ? true : false;
  },
  parse: (htmlNode) => {
    const data = new DataTemplate();

    data.hasSubnodes = true;
    data.type = 'StyledLists';
    data.containerSelector = 'li';
    data.itemCount = htmlNode.childElementCount;
    data.html = htmlNode.outerHTML;

    data.sections = (() => {
      const sectionIDs = [];
      [...htmlNode.children].forEach(section => {
        sectionIDs.push({
          numID: section.id.split('list-')[1],
          id: section.id
        });
      });
      return sectionIDs;
    })();

    data.subnodes = (() => {
      const subnodes = [];

      htmlNode.querySelectorAll('.sf-list-bullet-circular > li').forEach(bullet => {
        subnodes.push({
          numID: bullet.id.split('list-')[1],
          containerID: bullet.id,
          items: bullet.childElementCount > 0 ? [...bullet.children] : []
        });
      });
      return subnodes;
    })();

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

  render(item, options) {
    const params = {
      id: this.id,
      type: 'Styled Lists',
      controlsTemplate: this.controlsTemplate(this.id),
      draggableClass: options.draggableClass,
      componentTemplate: this.template(item),
      addTemplate: item.nodeLevel === 'main' ? AddContentBlockBtnTemplate(this.id) : ''
    };

    return ContentBlockTemplate(params);
  }

  template(existingData) {
    let numberingSections = ``;

    const numberingCountMin = existingData !== null && existingData.hasOwnProperty('sections') ? existingData.sections.length : this.numberingCountMin;

    for (let i = 0; i < numberingCountMin; i++) {
      const numberingID = existingData !== null && existingData.hasOwnProperty('sections') ? existingData.sections[i].numID : GenerateTabID();
      numberingSections += this.numberingSectionTemplate(numberingID);
    }

    return `<ol class="${this.cssClass}">${numberingSections}</ol>`;
  }

  controlsTemplate() {
    return `<button class="canvas-btn canvas-btn-xs" data-action="add-bullet-point" data-target="${this.id}">Add Bullet Point</button>`;
    // <select class="canvas-form-control" name="s-${this.id}" data-target="snippet-${this.id}"><option value="ol">Ordered List</option><option value="ul">Unordered List</option></select>
  }

  numberingSectionTemplate(numberingID) {
    return `<li id="list-${numberingID}"><div class="canvas-subcontainer" id="canvasSubContainer_${numberingID}"></div>${AddDeleteSubContentBlockBtnTemplate(numberingID)}</li>`;
  }

  deleteNumberingItem() {
    const targetListItem = this.getAttribute('data-target');
    document.getElementById(targetListItem).remove();
  }

  updateDOM(HTMLObject) {
    try {
      let numberingCurrentCount = this.numberingCurrentCount;

      const
        numberingCountMin = this.numberingCountMin,
        numberingSectionTemplateFxn = this.numberingSectionTemplate,
        deleteNumberingItemFxn = this.deleteNumberingItem;
      
      const setButtonStates = function () {
        const deleteBtns = [...HTMLObject.querySelectorAll('[data-action="remove-bullet"]')];
        deleteBtns.forEach(btn => {
          btn.disabled = deleteBtns.length > numberingCountMin
            ? false : (btn.classList.value.includes('disabled') ? false : true);
        });        
      };

      const bindControls = function (numberList) {
        const numberListID = numberList.id.split('list-')[1];
        UserInterfaceSortable({
          container: document.getElementById(`canvasSubContainer_${numberListID}`),
          contentDraggableClass: `.canvasDraggableSub_${numberListID}`
        });

        numberList.querySelector('[data-action="remove-bullet"]').onclick = deleteNumberingItemFxn;
      };
      
      const observer = new MutationObserver(mutations => {
        const nodes = mutations.length !== 0 && mutations[0].addedNodes.length !== 0 ?
          mutations[0].addedNodes : mutations[0].removedNodes;
        
        if (nodes) {
          for (let index = 0; index < mutations.length; index++) {
            nodes.forEach(li => {
              if (mutations[0].addedNodes.length !== 0) {
                numberingCurrentCount += 1;
                bindControls(li);
              }
              else {
                numberingCurrentCount -= 1;
              }
            });
          }
          setButtonStates();
        }
      });

      // Mutations
      observer.observe(HTMLObject.querySelector(`.${this.cssClass}`), {
        attributes: false,
        subtree: false,
        childList: true,
      });
      
      [...HTMLObject.querySelector('.sf-list-bullet-circular').children].forEach((numberList) => {        
        bindControls(numberList);
      });

      // Add New Line
      HTMLObject.querySelector('[data-action="add-bullet-point"]').onclick = () => {
        const listContainer = document.querySelector(`#snippet-${this.id} .${this.cssClass}`);
        const newListItemID = GenerateTabID();
        listContainer.insertAdjacentHTML('beforeend', numberingSectionTemplateFxn(newListItemID));
      };

      // HTMLObject.querySelector('select').onchange = function () {
      //   const listDOM = document.createElement(this.value);
      //   HTMLObject.querySelector('.canvas-content-snippet').appendChild(listDOM);
      // };

      setButtonStates();

    } catch (error) {
      console.log(error);
      console.log('NO HTML Object to attached to');
    }
  }
};