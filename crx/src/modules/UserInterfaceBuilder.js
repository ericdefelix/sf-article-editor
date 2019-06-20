import { EmptyStateTemplate, GetClosestParent } from './utils/chromeExtensionUtils';
import { Components, ComponentTypes } from './components/components';
const handler = {
  set(target, key, value) {
    console.log(`Setting value ${key} as ${value}`);
    target[key] = value;
  },
  get(target, key) {
    console.log(`Getting value of ${key}`);
    return target[key];
  },
  deleteProperty(target, key) {
    console.log(`Deleting ${key}`);
    delete target[key];
  }
};
let ProxyElements = {};
let Elements = {};

const Toolbox = {
  html: null,
  targetContainerID: '',
  init: () => {
    // Render Toolbox
    const template = Toolbox.render();
    const selectComponentBtn = document.querySelector('[data-action="select-component"]');
    document.getElementById('toolboxPlaceholder').insertAdjacentHTML('beforeend', template);

    // Init first add component button
    selectComponentBtn.onclick = function () {
      Toolbox.targetContainer = 'canvasContainer';
      Toolbox.display(this.parentElement);
    };

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
  display: (container) => {
    const toolbox = document.getElementById('toolbox');

    toolbox.classList.remove('in');
    toolbox.style.display = 'block';
    container.appendChild(toolbox);
    toolbox.style.left = 'calc(50% - ' + (toolbox.offsetWidth / 2 + 4) + 'px)';
    toolbox.classList.contains('in') ? toolbox.classList.remove('in') : toolbox.classList.add('in');
    toolbox.focus();
  }
};

const UserInterfaceBuilder = {
  container: null,
  deletedNode: null,
  addedNode: null,
  elements: {},
  proxy: {},
  init: (container, params) => {
    UserInterfaceBuilder.container = container;

    // If data is empty emptyStateTemplate, if not renderExistingData
    params.data.length === 0 ?
      UserInterfaceBuilder.renderEmptyState() :
      UserInterfaceBuilder.renderExistingData(params.data);

    // Attach mutation observer
    UserInterfaceBuilder.observe();
    ProxyElements = new Proxy(Elements, handler);

    Toolbox.init();
  },
  subscriber: (mutations) => {
    const addedNode = mutations[0].addedNodes;
    const deletedNode = mutations[0].removedNodes;

    console.log(addedNode, deletedNode);
    if (addedNode.length) {
      for (let index = 0; index < addedNode.length; index++) {
        const element = addedNode[index];
        element.querySelector('[data-action="remove-component"]').onclick = UserInterfaceBuilder._evtRemoveComponent;
      } 
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
    UserInterfaceBuilder.mutations.componentCount = data.length;
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
    delete UserInterfaceBuilder.proxy['canvasContainer'];
  }
};

export default UserInterfaceBuilder;