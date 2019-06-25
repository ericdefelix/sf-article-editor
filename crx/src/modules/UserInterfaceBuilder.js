import { GetClosestParent } from './utils/chromeExtensionUtils';
import { EmptyStateTemplate } from './utils/interfaceTemplates';
import { Components, ComponentTypes } from './components/components';

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

    // document.getElementById('toolbox').onfocusout = UserInterfaceBuilder.hide;
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

    toolbox.classList.remove('in');
    toolbox.style.display = 'block';
    container.appendChild(toolbox);
    toolbox.style.left = 'calc(50% - ' + (toolbox.offsetWidth / 2 + 4) + 'px)';
    toolbox.classList.contains('in') ? toolbox.classList.remove('in') : toolbox.classList.add('in');
    toolbox.focus();

    // Record which add component button the user is clicking. If yes, append after this button
    UserInterfaceBuilder.placeholderPointerID = GetClosestParent(this, '.canvas-content-block').id;
    console.log(UserInterfaceBuilder.placeholderPointerID);

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
  currentContainerID: '',
  placeholderPointerID: '',
  elements: {},
  init: (container, params) => {
    UserInterfaceBuilder.container = container;

    // Attach mutation observer
    UserInterfaceBuilder.observe();

    // If data is empty emptyStateTemplate, if not renderExistingData
    params.data.length === 0 ?
      UserInterfaceBuilder.renderEmptyState() :
      UserInterfaceBuilder.renderExistingData(params.data);

    Toolbox.init();
  },
  subscriber: (mutations) => {    
    const emptyStateContainer = document.querySelector('[data-content="empty"]');
    const canvasContainer = document.getElementById('canvasContainer');

    console.log(mutations);
    
    if (mutations.length !== 0) {
      if (mutations[0].addedNodes.length !== 0) {
        for (let index = 0; index < mutations.length; index++) {
          const element = mutations[index].addedNodes[0];
          UserInterfaceBuilder.addedNode = element;
          if (element.getAttribute('data-content') !== 'empty') {
            element.querySelector('[data-action="remove-component"]').onclick = UserInterfaceBuilder._evtRemoveComponent;
            element.querySelectorAll('[data-action="select-component"]').forEach(btn => {
              btn.onclick = Toolbox.display;
            });
          }
        } 
      }

      Toolbox.hide();

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
  observe: () => {
    // instantiating observer
    const containerObserver = new MutationObserver(UserInterfaceBuilder.subscriber);

    // observing target
    containerObserver.observe(UserInterfaceBuilder.container, {
      attributes: false,
      subtree: false,
      childList: true
    });

    // TODO: DC if sorting
  },
  renderEmptyState: () => {
    UserInterfaceBuilder.container.insertAdjacentHTML('afterbegin', EmptyStateTemplate(UserInterfaceBuilder.container.id));
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
    });
  },
  _evtAddComponent: function () {
    const
      componentType = this.getAttribute('data-ui-label'),
      component = new Components[componentType],
      componentTemplate = component.render(),
      targetPreviousElementSibling = document.getElementById(UserInterfaceBuilder.placeholderPointerID);
    
    targetPreviousElementSibling.insertAdjacentHTML('afterend', componentTemplate);
    
    // Apply Events and Behavior
    const appendedChild = targetPreviousElementSibling.nextElementSibling;
    component.updateDOM(appendedChild);
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