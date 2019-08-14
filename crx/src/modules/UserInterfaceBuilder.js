import { Toolbox } from './Toolbox';
import { Components } from './components/components';
import { UserInterfaceSortable } from '../modules/utils/sortableHandler';
import { EmptyStateTemplate } from '../modules/utils/interfaceTemplates';

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
    UserInterfaceBuilder.observe('canvasContainer',1);

    // If data is empty emptyStateTemplate, if not renderExistingData
    params.data.length === 0 ?
      UserInterfaceBuilder.renderEmptyState() :
      UserInterfaceBuilder.renderExistingData(params.data);

    Toolbox.init(UserInterfaceBuilder);

    document.getElementById('toolbox').querySelectorAll('[data-action="add-component"]').forEach((action) => {
      action.onclick = UserInterfaceBuilder._evtAddComponent;
    });

    UserInterfaceBuilder.initEmptyStateButton();
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
            }
          }
        }
      }

      if (emptyStateContainer !== null && emptyStateContainer.nextElementSibling !== null) {
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
  observe: (containerID,nodeLevel) => {
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
    UserInterfaceBuilder.container.insertAdjacentHTML('afterbegin', EmptyStateTemplate('canvasContainer'));
  },
  renderExistingData: (data) => {
    UserInterfaceBuilder.elementCount = data.length;    

    const canvasContainer = 'canvasContainer', canvasDraggableMain = 'canvasDraggableMain';
    
    data.forEach((item) => {
      // Create a component instance
      const component = new Components[item.type];
      const componentTemplate = component.render(item.hasSubnodes ? item.subnodes.titles : item.html, {
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
        // appendedChild.querySelectorAll(component.selectorDOMSections).forEach(domNode => {
        //   domNode.querySelector('.canvas-subcontainer').insertAdjacentHTML('beforeend', 'test');
        // });
      }

    });

    UserInterfaceSortable({
      container: document.getElementById(canvasContainer),
      contentDraggableClass: '.' + canvasDraggableMain
    });
  },
  _evtAddComponent: function () {
    let targetPreviousElementSibling, appendedChild;

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
      targetPreviousElementSibling.insertAdjacentHTML('afterend', componentTemplate);
      appendedChild = targetPreviousElementSibling.nextElementSibling;
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
  initEmptyStateButton: () => {
    // Init first add component button
    document.querySelector('[data-action="select-component"]').onclick = UserInterfaceBuilder.toolboxDisplay;
  }
};

export default UserInterfaceBuilder;