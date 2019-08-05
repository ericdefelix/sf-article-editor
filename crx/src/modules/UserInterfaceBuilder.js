import { GetClosestParent } from './utils/chromeExtensionUtils';
import { Components, ComponentTypes } from './components/components';
// import {
//   EmptyStateTemplate,
//   ContentBlockTemplate,
//   AddContentBlockBtnTemplate
// } from './utils/interfaceTemplates';

const Elements = {
  targetNodeLevel: '',
  placeholderPointerID: '',
  items: {}
};

const Toolbox = {
  init: () => {
    // Render Toolbox
    const template = Toolbox.render();
    document.getElementById('toolboxPlaceholder').insertAdjacentHTML('beforeend', template);

    UserInterfaceBuilder.initEmptyStateButton();

    //Bind event for adding components
    document.querySelectorAll('[data-action="add-component"]').forEach(btn => {     
      btn.onclick = UserInterfaceBuilder._evtAddComponent;
    });
  },
  render: () => {
    let template = `<div class="toolbox" id="toolbox"><ul class="toolbox-toolbar" id="toolbar" tabIndex="-1">`;
    
    for (const key in ComponentTypes) {   
      template += `<li class="toolbar-item" data-action="add-component" data-ui-label="${key}">
				<small>${ ComponentTypes[key] }</small>
			</li>`;
    }

    return template + `</ul></div>`;
  },
  display: function () {
    const toolbox = document.getElementById('toolbox');
    const container = this.parentElement;
    toolbox.parentNode.removeChild(toolbox);
    container.appendChild(toolbox);

    toolbox.classList.remove('in');
    toolbox.style.display = 'block';
    toolbox.style.left = 'calc(50% - ' + (toolbox.offsetWidth / 2 + 4) + 'px)';
    toolbox.classList.contains('in') ? toolbox.classList.remove('in') : toolbox.classList.add('in');
    toolbox.focus();
    
    // Record which add component button the user is clicking. If yes, append after this button
    UserInterfaceBuilder.targetNodeLevel = parseInt(this.getAttribute('data-node-level'));
    UserInterfaceBuilder.placeholderPointerID = this.getAttribute('data-target');
  },
  hide: () => {
    document.getElementById('toolboxPlaceholder').appendChild(document.getElementById('toolbox'));
  }
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
    UserInterfaceBuilder.observe('canvasContainer',1);

    // If data is empty emptyStateTemplate, if not renderExistingData
    params.data.length === 0 ?
      UserInterfaceBuilder.renderEmptyState() :
      UserInterfaceBuilder.renderExistingData(params.data);

    Toolbox.init();
  },
  subscriber: (mutations) => {
    const emptyStateContainer = document.querySelector('[data-content="empty"]');
    const canvasContainer = document.getElementById('canvasContainer');

    // console.log(mutations);
    if (mutations.length !== 0) {
      if (mutations[0].addedNodes.length !== 0) {

        for (let index = 0; index < mutations.length; index++) {
          const element = mutations[index].addedNodes[0];
          
          if (element.getAttribute('data-content') !== 'empty' && element.classList.contains('canvas-content-block')) {
            element.querySelector('[data-action="remove-component"]').onclick = UserInterfaceBuilder._evtRemoveComponent;
            element.querySelector('.content-action-hotspot [data-action="select-component"]').onclick = Toolbox.display;

            if (element.querySelector('.subcontent-action-hotspot') !== null) {
              element.querySelectorAll('.subcontent-action-hotspot [data-action="select-component"]').forEach(btn => {
                btn.onclick = Toolbox.display;
              });
            }
          }
        }
      }

      // Toolbox.hide();

      if (emptyStateContainer !== null && emptyStateContainer.nextElementSibling !== null) {
        emptyStateContainer.remove();
      }
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

    // TODO: DC if sorting
  },
  renderEmptyState: () => {
    UserInterfaceBuilder.container.insertAdjacentHTML('afterbegin', EmptyStateTemplate('canvasContainer'));
  },
  renderExistingData: (data) => {
    UserInterfaceBuilder.elementCount = data.length;

    data.forEach((item) => {
      // Create a component instance
      const component = new Components[item.type];
      const componentTemplate = component.render(item.html);

      // Attach to DOM
      document.getElementById('canvasContainer').insertAdjacentHTML('beforeend', componentTemplate);

      // Apply Events and Behavior
      const appendedChild = document.getElementById('canvasContainer').lastElementChild;
      component.updateDOM(appendedChild);

      UserInterfaceBuilder.elements[component.id] = component;
    });
  },
  _evtAddComponent: function () {
    const
      componentType = this.getAttribute('data-ui-label'),
      component = new Components[componentType],
      componentTemplate = component.render();
    
    UserInterfaceBuilder.elements[component.id] = component;
    
    let targetPreviousElementSibling, appendedChild;

    const containerID = UserInterfaceBuilder.targetNodeLevel == 2 ?
      `canvasSubContainer_${UserInterfaceBuilder.placeholderPointerID}` : UserInterfaceBuilder.placeholderPointerID;

    targetPreviousElementSibling = document.getElementById(containerID);

    if (UserInterfaceBuilder.targetNodeLevel === 1) {
      targetPreviousElementSibling.insertAdjacentHTML('afterend', componentTemplate);
      appendedChild = targetPreviousElementSibling.nextElementSibling;
    }

    if (UserInterfaceBuilder.targetNodeLevel === 2) {
      targetPreviousElementSibling.insertAdjacentHTML('beforeend', componentTemplate);
      appendedChild = targetPreviousElementSibling.lastElementChild;
      // targetPreviousElementSibling.removeChild(targetPreviousElementSibling.querySelector('.canvas-add-component'));
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
    const selectComponentBtn = document.querySelector('[data-action="select-component"]');
    selectComponentBtn.onclick = Toolbox.display;
  }
};

export default UserInterfaceBuilder;