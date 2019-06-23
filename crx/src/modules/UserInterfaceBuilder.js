import { EmptyStateTemplate, GetClosestParent } from './utils/chromeExtensionUtils';
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
  },
  hide: () => {
    document.getElementById('toolboxPlaceholder').appendChild(document.getElementById('toolbox'));
  }
};

const UserInterfaceBuilder = {
  container: null,
  deletedNode: null,
  addedNode: null,
  elements: {},
  init: (container, params) => {
    UserInterfaceBuilder.container = container;

    // If data is empty emptyStateTemplate, if not renderExistingData
    params.data.length === 0 ?
      UserInterfaceBuilder.renderEmptyState() :
      UserInterfaceBuilder.renderExistingData(params.data);

    // Attach mutation observer
    UserInterfaceBuilder.observe();
    Toolbox.init();
  },
  subscriber: (mutations) => {
    const addedNode = mutations[0].addedNodes;
    const deletedNode = mutations[0].removedNodes;
    const emptyStateContainer = document.querySelector('[data-content="empty"]');
    const canvasContainer = document.getElementById('canvasContainer');
    
    if (addedNode.length !== 0) {
      for (let index = 0; index < addedNode.length; index++) {
        const element = addedNode[index];

        if (element.getAttribute('data-content') !== 'empty') {
          element.querySelector('[data-action="remove-component"]').onclick = UserInterfaceBuilder._evtRemoveComponent;
          element.querySelector('[data-action="select-component"]').onclick = Toolbox.display;          
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
      attributes: true,
      subtree: false,
      childList: true
    });
  },
  renderEmptyState: () => {
    UserInterfaceBuilder.container.insertAdjacentHTML('afterbegin', EmptyStateTemplate(UserInterfaceBuilder.container.id));
  },
  renderExistingData: (data) => {
    // TODO
    const test = `<div class="sf-editor-content"><p>This is a test. The quick brown fox</p></div>`;
    const
      componentType = 'TextContent',
      component = new Components[componentType],
      componentTemplate = component.render(test);
    
    document.getElementById('canvasContainer').insertAdjacentHTML('beforeend', componentTemplate);
    // UserInterfaceBuilder.mutations.componentCount = data.length;
  },
  renderTo: () => {

  },
  _evtAddComponent: function () {
    const
      componentType = this.getAttribute('data-ui-label'),
      containerID = GetClosestParent(this,'[data-attached-to]').getAttribute('data-attached-to'),
      component = new Components[componentType],
      componentTemplate = component.render();
    
    document.getElementById(containerID).insertAdjacentHTML('beforeend', componentTemplate);
  },
  _evtRemoveComponent: function () {
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