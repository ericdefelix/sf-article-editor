import { replaceString } from './utils/chromeExtensionUtils';
import ContentBlocks from './ContentBlocks';

const UserInterfaceBuilder = {
  canvasContainer: document.getElementById('canvasContainer'),
  render: (area, data) => {
    UserInterfaceBuilder[area](data);
  },
  toolbox: (contentTypes) => {
    let tmpl = `<div class="toolbox" id="toolbox"><ul class="toolbox-toolbar" id="toolbar" tabIndex="-1">`;

    for (const key in contentTypes) {
      tmpl += `<li class="toolbar-item" data-action="add-component" data-ui-label="${key}">
				<small>${contentTypes[key].ui_label}</small>
			</li>`;
    }

    UserInterfaceBuilder.canvasContainer.insertAdjacentHTML('beforeend', tmpl + `</ul></div>`);
  },
  canvas: (obj) => {
    const
      elementCount = obj.data.length,
      data = obj.data,
      triggerBy = obj.trigger,
      emptyStateContainer = document.querySelector('[data-content="empty"]');

    const getSubnodesHTML = (dataItem) => {
      let subnodesHTML = ``;

      // Render the entire tabs HTML
      subnodesHTML = UserInterfaceBuilder.renderContentBlock({
        id: dataItem.id,
        type: dataItem.type,
        data: ContentBlocks.elems[dataItem.type],
        template: ContentBlocks.elems[dataItem.type].template({ subnodes: dataItem.metadata.subnodes }),
        tabContentId: false,
      });

      dataItem.metadata.subnodes.forEach(subNodeTab => {
        let tabContentHTML = ``;
        tabContentHTML = subNodeTab.content.reduce((tabContentHTML, tabContentNode) => {
          const config = () => {
            return ContentBlocks.elems[tabContentNode.type].hasHeaderBodyText ?
              { header: tabContentNode.metadata.header, body: tabContentNode.metadata.body, ui_value: tabContentNode.metadata.ui_value } : null;
          };

          return tabContentHTML +=
            UserInterfaceBuilder.renderContentBlock({
              type: tabContentNode.type,
              id: tabContentNode.id,
              data: ContentBlocks.elems[tabContentNode.type],
              template: ContentBlocks.elems[tabContentNode.type].template(config()),
              metadata: tabContentNode.metadata,
              tabContentId: tabContentNode.id
            });
        }, tabContentHTML);
        subnodesHTML = replaceString(subnodesHTML, '{{ tab-' + subNodeTab.id + ' }}', tabContentHTML);
      });

      return subnodesHTML;
    };

    const renderExistingData = () => {
      let existingHTML = ``;
      try {
        existingHTML = data.reduce((existingHTML, dataItem) => {
          const hasSubnodes = dataItem.metadata.hasOwnProperty('subnodes') && dataItem.metadata.subnodes.length > 0;

          return existingHTML += hasSubnodes ? getSubnodesHTML(dataItem) :
            UserInterfaceBuilder.renderContentBlock({
              id: dataItem.id,
              type: dataItem.type,
              data: ContentBlocks.elems[dataItem.type],
              template: dataItem.metadata.html,
              metadata: dataItem.metadata,
              tabContentId: false
            });
        }, existingHTML);
      } catch (e) {
        console.log('ContentBlocks module is missing');
        console.log(e);
      }
      return existingHTML;
    };

    if (triggerBy == 'auto') {
      let canvasInitHTML = '';
      canvasInitHTML = elementCount > 0 ? renderExistingData() : UserInterfaceBuilder.renderEmptyState();
      UserInterfaceBuilder.canvasContainer.innerHTML = canvasInitHTML;
    }

    if (triggerBy == 'user') {
      if (elementCount == 0) {
        UserInterfaceBuilder.canvasContainer.insertAdjacentHTML('afterbegin', UserInterfaceBuilder.renderEmptyState());
      }
      if (elementCount == 1 && emptyStateContainer) {
        const toolbox = document.getElementById('toolbox');

        toolbox.parentNode.removeChild(toolbox);
        UserInterfaceBuilder.canvasContainer.removeChild(emptyStateContainer);
        UserInterfaceBuilder.canvasContainer.appendChild(toolbox);
      }
    }

    if (obj.hasOwnProperty('callback')) {
      obj.callback();
    }
  },
  content: (obj) => {
    const
      triggerParent = obj.trigger.closest('.canvas-content-block'),
      dataContent = triggerParent.getAttribute('data-content'),
      isForTabs = document.getElementById('toolbox').previousElementSibling.classList.contains('forTabs');

    obj['template'] = obj.data.template();
    obj['tabContentId'] = false;

    if (dataContent === 'empty') {
      UserInterfaceBuilder.canvasContainer.insertAdjacentHTML('beforeend', UserInterfaceBuilder.renderContentBlock(obj) );
    }
    else {
      if (!isForTabs) {
        triggerParent.insertAdjacentHTML('afterend', UserInterfaceBuilder.renderContentBlock(obj));
      }
      else {
        const
          tabContentIn = triggerParent.querySelector('.sf-tab-content.in'),
          tabContentId = tabContentIn.getAttribute('id'),
          subContent = triggerParent.querySelector('.sf-tab-content.in');
          // tabParentId = subContent.getAttribute('id');
        
        obj['tabContentId'] = tabContentId;
        subContent.childNodes.length == 0 ? (subContent.innerHTML = '') : subContent.insertAdjacentHTML('beforeend', UserInterfaceBuilder.renderContentBlock(obj));
      }
    }

    obj.callback(document.querySelectorAll('#' + obj.id + ' .canvas-add-component [data-action="select-component"]'));
  },
  renderContentBlock: (obj) => {
    const tmpl = `
    <section class="canvas-content-block" id="${obj.id}">
      <div class="canvas-content-config">
        <span class="canvas-content-draggable 
          ${ !obj.tabContentId ? `canvasDraggableMain` :
        `canvasDraggableSub_` + obj.tabContentId}"></span>
          ${obj.data.hasOwnProperty('types') ? UserInterfaceBuilder.renderOptions(obj) : ''}
          ${!obj.data.hasChildContent ? '' :
        `<button class="canvas-btn canvas-btn-xs" 
            data-action="edit-tab"
            data-target="snippet-${obj.id}" data-target-type="${obj.type}">Edit Tabs</button>`
      }
        <button class="canvas-btn canvas-btn-xs" 
          data-action="remove-component"
          data-target="${obj.id}" data-target-type="${obj.type}">
          <i class="icon-delete"></i> Remove
        </button>
      </div>
      <div class="canvas-content-snippet" id="snippet-${obj.id}" data-component-type="${obj.type}">
        ${obj.template}
      </div>
      ${ obj.data.hasChildContent ? UserInterfaceBuilder.renderAddSubContent() : ``}
      ${ !obj.tabContentId ? UserInterfaceBuilder.renderAddMainContent() : ``}
    </section>`;

    return tmpl;
  },
  renderOptions: (obj) => {    
    let opts = '';
    for (let i = 0; i <= obj.data.types.length - 1; i++) {
      opts +=
        `<option value="${obj.data.types[i].ui_value}" 
          ${ typeof obj.metadata !== 'undefined' ? (obj.data.types[i].ui_value == obj.metadata.ui_value ? ' selected' : '') : '' }>
          ${obj.data.types[i].ui_label}
        </option>`;
    }

    return `<select class="canvas-form-control" name="s-${obj.id}" data-target="snippet-${obj.id}">${opts}</select>`;
  },
  renderAddSubContent: () => {
    const str = `
    <div class="canvas-add-component canvas-add-subcontent">
      <button type="button" class="canvas-btn canvas-btn-xs btn-has-text forTabs" data-action="select-component">
        <i class="icon-plus">&#43;</i> Add Content to this tab
      </button>
    </div>
    `;
    return str;
  },
  renderAddMainContent: () => {
    const str = `
      <div class="canvas-content-action canvas-add-component">
        <div class="content-action-hotspot">
          <button type="button" class="canvas-btn canvas-btn-xs" data-action="select-component">
            <i class="icon-plus">&#43;</i>
          </button>
        </div>
      </div>
    `;
    return str;
  },
  renderEmptyState: () => {
    return `<section class="canvas-content-block" data-content="empty"> 
        <img src="images/empty-icon.svg" alt="Empty">
        <h4 class="empty-text">There's nothing in here.<br><small>Start building your content.</small></h4>
        <div class="canvas-add-component">
          <button type="button" class="canvas-btn canvas-btn-primary" data-action="select-component">
            Add Content Block
          </button>
        </div>
      </section>`;
  },
  update: () => {
  }
};

export default UserInterfaceBuilder;