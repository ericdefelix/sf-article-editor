import { EmptyStateTemplate } from './utils/chromeExtensionUtils';
import { Components, ComponentTypes } from './components/components';

const Toolbox = {
  html: null,
  init: () => {
    // Render Toolbox
    const template = Toolbox.render();
    const selectComponentBtn = document.querySelector('[data-action="select-component"]');
    document.getElementById('toolboxPlaceholder').insertAdjacentHTML('beforeend', template);

    // Init first add component button
    selectComponentBtn.onclick = function () {
      Toolbox.display(this.parentElement);
    };

    //Bind event for adding components
    document.querySelectorAll('[data-action="add-component"]').forEach(btn => {
      btn.onclick = Toolbox._bindEvtAddComponent;
    });
  },
  _bindEvtAddComponent: function () {
    const
      componentType = this.getAttribute('data-ui-label'),
      component = new Components[componentType],
      componentTemplate = component.render();

    UserInterfaceBuilder.container.insertAdjacentHTML('beforeend', componentTemplate);
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
  display: (container) => {
    const toolbox = document.getElementById('toolbox');

    toolbox.classList.remove('in');
    toolbox.style.display = 'block';

    container.appendChild(toolbox);
    // const isAddingFromTab = this.parentElement.classList.contains('canvas-add-subcontent');
    // toolbox.style.left = isAddingFromTab ? '0' : 'calc(50% - ' + (toolboxWidth / 2 + 4) + 'px)';
    const toolboxWidth = toolbox.offsetWidth;
    toolbox.style.left = 'calc(50% - ' + (toolboxWidth / 2 + 4) + 'px)';
    toolbox.classList.contains('in') ? toolbox.classList.remove('in') : toolbox.classList.add('in');
    toolbox.focus();
  }
};

const UserInterfaceBuilder = {
  container: document.getElementById('canvasContainer'),
  toolboxIsInit: false,
  toolboxActiveSection: null,
  mutations: {
    componentCount: 0,
  },
  render: (container, params) => {
    UserInterfaceBuilder.container = container;

    // Attach mutation observer
    UserInterfaceBuilder.observe(container);
    UserInterfaceBuilder.renderInitState(params);
    Toolbox.init();
  },
  observe: (container) => {
    // config object
    const config = {
      attributes: true,
      subtree: false,
      childList: true
      // attributeOldValue: true,
      // characterData: true,
      // characterDataOldValue: true,
      // childList: true,
    };

    // subscriber function
    const subscriber = (mutations) => {
      console.log(mutations);
      
      // mutations.forEach((mutation) => {
      //   console.log(mutation);

      //   if (mutation.addedNodes.length) {
      //     if (mutation.addedNodes[0].classList.value == 'canvas-content-block') {
      //       UserInterfaceBuilder._bindDisplayToolbox(mutation.addedNodes[0]);
      //       UserInterfaceBuilder.toolboxActiveSection = mutation.addedNodes[0];
      //     }
      //   }
      // });
      const
        addedNode = mutations[0].addedNodes,
        removedNode = mutations[0].removedNodes;
    };

    // instantiating observer
    const containerObserver = new MutationObserver(subscriber);

    // observing target
    containerObserver.observe(container, config);
  },
  renderInitState: (params) => {
    // If data is empty emptyStateTemplate, if not renderExistingData
    params.data.length === 0 ?
      UserInterfaceBuilder.renderEmptyState() :
      UserInterfaceBuilder.renderExistingData(params.data);
  },
  renderEmptyState: () => {
    UserInterfaceBuilder.container.insertAdjacentHTML('afterbegin', EmptyStateTemplate());
    UserInterfaceBuilder.mutations.componentCount = 0;
  },
  renderExistingData: (data) => {
    UserInterfaceBuilder.mutations.componentCount = data.length;
  }
};

export default UserInterfaceBuilder;