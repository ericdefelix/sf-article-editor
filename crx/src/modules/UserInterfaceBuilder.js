import { Toolbox } from './Toolbox';
import TextContent from './components/text-content';
import Info from './components/info';
import Tips from './components/tips';
import StyledLists from './components/styled-lists';
import Tabs from './components/tabs';
import Accordion from './components/accordion';

import ImageGallery from './ImageGallery';
import { UserInterfaceSortable } from '../modules/utils/sortableHandler';
import { EmptyStateTemplate } from '../modules/utils/interfaceTemplates';

const Components = {
  TextContent,
  Info,
  Tips,
  StyledLists,
  Tabs,
  Accordion
};

const UserInterfaceBuilder = {
  container: null,
  deletedNode: null,
  addedNode: null,
  elementCount: 0,
  targetNodeLevel: '',
  placeholderPointerID: '',
  elements: {},
  init: (container, params) => {
    UserInterfaceBuilder.container = container;

    // Attach mutation observer
    UserInterfaceBuilder.observe('canvasContainer');

    // If data is empty emptyStateTemplate, if not renderExistingData
    params.data.length === 0 ?
      UserInterfaceBuilder.renderEmptyState() :
      UserInterfaceBuilder.renderExistingData(params.data);

    Toolbox.init(UserInterfaceBuilder);

    document.getElementById('toolbox').querySelectorAll('[data-action="add-component"]').forEach(action => {
      action.onclick = UserInterfaceBuilder._evtAddComponent;
    });

    UserInterfaceBuilder.initEmptyStateButton();

    if (typeof params.images !== 'undefined') {
      ImageGallery.init({
        data: typeof params.images === 'undefined' ? [] : params.images
      }); 
    }
  },
  toolboxDisplay: function () {    
    UserInterfaceBuilder.targetNodeLevel = parseInt(this.getAttribute('data-node-level'));
    UserInterfaceBuilder.placeholderPointerID = this.getAttribute('data-target');
    Toolbox.display(this);
  },
  subscriber: (mutations) => {
    const emptyStateContainer = document.querySelector('[data-content="empty"]');
    const canvasContainer = document.getElementById('canvasContainer');
    const displayToolboxButtons = document.querySelectorAll('[data-action="select-component"]');

    if (mutations.length !== 0) {
      if (mutations[0].addedNodes.length !== 0) {

        for (let index = 0; index < mutations.length; index++) {
          if (typeof mutations[index].addedNodes[0] !== 'undefined' && mutations[index].addedNodes[0].nodeType == 1) {
            const element = mutations[index].addedNodes[0];

            if (element.getAttribute('data-content') !== 'empty' && element.classList.contains('canvas-content-block')) {
              element.querySelector('[data-action="remove-component"]').onclick = UserInterfaceBuilder._evtRemoveComponent;
              element.querySelector('[data-action="toggle-view-component"]').onclick = UserInterfaceBuilder._evtToggleViewComponent;
            }
          }
        }
      }

      if (emptyStateContainer !== null && emptyStateContainer.nextElementSibling !== null) {
        document.getElementById('btnPreview').disabled = false;
        document.getElementById('btnSave').disabled = false;
        emptyStateContainer.remove();
      }

      displayToolboxButtons.forEach((button) => {
        if (!button.classList.value.includes('displayInit')) {
          button.onclick = UserInterfaceBuilder.toolboxDisplay;
          button.classList.add('displayInit');
        }
      });
    }
    
    if (emptyStateContainer === null && canvasContainer.firstElementChild === null) {
      UserInterfaceBuilder.renderEmptyState();
    }

    if (emptyStateContainer !== null) {
      UserInterfaceBuilder.initEmptyStateButton();
    }    
  },
  observe: (containerID) => {
    // instantiating observer
    const containerObserver = new MutationObserver(UserInterfaceBuilder.subscriber);
    const observedElement = document.getElementById(containerID);

    // observing target
    containerObserver.observe(observedElement, {
      attributes: false,
      subtree: true,
      childList: true
    });
  },
  renderEmptyState: () => {
    document.getElementById('btnPreview').disabled = true;
    document.getElementById('btnSave').disabled = true;
    UserInterfaceBuilder.container.insertAdjacentHTML('afterbegin', EmptyStateTemplate('canvasContainer'));
  },
  renderExistingData: (data) => {
    UserInterfaceBuilder.elementCount = data.length;
    const canvasContainer = 'canvasContainer', canvasDraggableMain = 'canvasDraggableMain';
    
    data.forEach((item) => {
      // Create a component instance
      const component = new Components[item.type];
      const componentTemplate = component.render(item.hasSubnodes ? item.subnodes.containers : item.html, {
        nodeLevel: 1,
        draggableClass: canvasDraggableMain
      });

      // Attach to DOM
      document.getElementById(canvasContainer).insertAdjacentHTML('beforeend', componentTemplate);

      // Apply Events and Behavior
      const appendedChild = document.getElementById(canvasContainer).lastElementChild;
      
      component.updateDOM(appendedChild);

      // If component has child nodes
      if (item.hasSubnodes) {
        item.subnodes.containers.forEach((container, index) => {
          // Attach to DOM
          item.subnodes.elements[index].forEach(element => {
            const
              subComponent = new Components[element.type],
              subComponentTemplate = subComponent.render(element.html, {
                nodeLevel: 2,
                draggableClass: `canvasDraggableSub_${container.id}`
              }),
              subContainer = document.getElementById(`canvasSubContainer_${container.id}`);
            
            subContainer.insertAdjacentHTML('beforeend', subComponentTemplate);

            // Apply Events and Behavior            
            subComponent.updateDOM(subContainer.lastElementChild, UserInterfaceBuilder.images);
          });
        });
      }

    });
    
    UserInterfaceSortable({
      container: document.getElementById(canvasContainer),
      contentDraggableClass: '.' + canvasDraggableMain
    });
  },
  _evtAddComponent: function () {
    let targetPreviousElementSibling, appendedChild;

    const emptyStateContainer = document.querySelector('[data-content="empty"]');
    const canvasContainer = document.getElementById('canvasContainer');

    const containerID = UserInterfaceBuilder.targetNodeLevel == 2 ?
      `canvasSubContainer_${UserInterfaceBuilder.placeholderPointerID}` : UserInterfaceBuilder.placeholderPointerID;

    const
      componentType = this.getAttribute('data-ui-label'),
      component = new Components[componentType];
    
    const options = {
      nodeLevel: UserInterfaceBuilder.targetNodeLevel,
      draggableClass: UserInterfaceBuilder.targetNodeLevel == 2 ?
        `canvasDraggableSub_${UserInterfaceBuilder.placeholderPointerID}` : 'canvasDraggableMain'
    };

    const componentTemplate = component.render('', options);
    
    targetPreviousElementSibling = document.getElementById(containerID);
    
    if (UserInterfaceBuilder.targetNodeLevel === 1) {
      if (emptyStateContainer !== null) {
        canvasContainer.insertAdjacentHTML('beforeend', componentTemplate);
        appendedChild = canvasContainer.lastElementChild;
      }
      else {
        targetPreviousElementSibling.insertAdjacentHTML('afterend', componentTemplate);
        appendedChild = targetPreviousElementSibling.nextElementSibling;
      }
    }

    if (UserInterfaceBuilder.targetNodeLevel === 2) {
      targetPreviousElementSibling.insertAdjacentHTML('beforeend', componentTemplate);
      appendedChild = targetPreviousElementSibling.lastElementChild;
    }

    // Apply Events and Behavior
    component.updateDOM(appendedChild);

    // Hide toolbox popup
    Toolbox.hide();
  },
  _evtRemoveComponent: function () {
    Toolbox.hide();
    const targetContainerID = this.getAttribute('data-target');
    document.getElementById(targetContainerID).remove();
  },
  _evtToggleViewComponent: function () {
    const
      targetID = this.getAttribute('data-target'),
      contentBlock = document.getElementById(targetID),
      icon = this.querySelector('i');
    
    contentBlock.classList.value.includes('collapsed') ?
      contentBlock.classList.remove('collapsed') : contentBlock.classList.add('collapsed');
    
    icon.classList.value = icon.classList.value === 'icon-collapse' ? 'icon-expand' : 'icon-collapse';
  },
  initEmptyStateButton: () => {
    // Init first add component button
    document.querySelector('[data-action="select-component"]').onclick = UserInterfaceBuilder.toolboxDisplay;
  }
};

export default UserInterfaceBuilder;