module.exports = {
  canvasContainer: document.getElementById('canvasContainer'),
  render: function(area, data) {
  	this[area](data);
  },
  toolbox: function(contentTypes) {
  	let tmpl = `<div class="toolbox" id="toolbox"><ul class="toolbox-toolbar" id="toolbar" tabIndex="-1">`;
  	for (key in contentTypes) {
  		tmpl += `<li class="toolbar-item" data-action="add-component" data-ui-label="${key}">
				<small>${contentTypes[key].ui_label}</small>
			</li>`;
  	}
  	this.canvasContainer.insertAdjacentHTML('beforeend', tmpl + `</ul></div>`);
  },
  canvas: function(obj) {
    const
      elementCount = obj.data.length,
      data = obj.data,
      triggerBy = obj.trigger,
      ContentBlocks = obj.dependencies[0],
      replaceStr = obj.dependencies[1],
      emptyStateContainer = document.querySelector('[data-content="empty"]');

    const renderEmptyState = () => {
      const tmpl = `
      <section class="canvas-content-block" data-content="empty"> 
        <img src="images/empty-icon.svg" alt="Empty">
        <h4 class="empty-text">There's nothing in here.<br><small>Start building your content.</small></h4>
        <div class="canvas-add-component">
          <button type="button" class="canvas-btn canvas-btn-primary" data-action="select-component">
            Add Content Block
          </button>
        </div>
      </section>`;
      return tmpl;
    };

    const renderExistingData = () => {
      let tmpl = ``;
      try {
        for (let i = 0; i <= data.length - 1; i++) {
          const id = data[i].id, 
                type = data[i].type, 
                metadata = data[i].metadata;

          let existingDataObj, elementTemplate;

          existingDataObj = { id: id, type: type, data: ContentBlocks.elems[type] };

          if (metadata.hasOwnProperty('subnodes') && metadata.subnodes.length > 0) {  
            elementTemplate = ContentBlocks.elems[type].template({ subnodes: metadata.subnodes });

            let tabsHTML = module.exports.renderContentBlock(existingDataObj, elementTemplate, undefined);

            for (let x = 0; x <= metadata.subnodes.length - 1; x++) {
              const snode = metadata.subnodes[x];
              let snodeChildrenHTML = '';

              if (snode.content.length > 0) {
                for (let y = 0; y <= snode.content.length - 1; y++) {
                  const tabContentObj = { 
                    type: snode.content[y].type, 
                    id: snode.content[y].id,
                    data: ContentBlocks.elems[snode.content[y].type]
                  };

                  const tabContentElemHTML = ContentBlocks.elems[snode.content[y].type].template();
                  snodeChildrenHTML += module.exports.renderContentBlock(tabContentObj, tabContentElemHTML, snode.id);
                }
              }

              tabsHTML = replaceStr(tabsHTML, '{{ tab-'+ snode.id +' }}', snodeChildrenHTML);
            }
            tmpl += tabsHTML;
          }
          else {
            elementTemplate = metadata.html;
            tmpl += module.exports.renderContentBlock(existingDataObj,elementTemplate,undefined);
          }
        }
      } catch(e) {
        console.log(e);
        console.log('ContentBlocks module is missing');
      }
      return tmpl;
    };

  	if (triggerBy == 'auto') {
			let canvasInitHTML = '';
			canvasInitHTML = elementCount > 0 ? renderExistingData() : renderEmptyState();
			this.canvasContainer.innerHTML = canvasInitHTML;
  	}
    
    if (triggerBy == 'user') {
      if (elementCount == 0) {
        this.canvasContainer.insertAdjacentHTML('afterbegin', renderEmptyState());
      }
      if (elementCount == 1 && emptyStateContainer) {
  			const toolbox = document.getElementById('toolbox');

  			toolbox.parentNode.removeChild(toolbox);
  			this.canvasContainer.removeChild(emptyStateContainer);
  			this.canvasContainer.appendChild(toolbox);
  		}
    }
    
    if (obj.hasOwnProperty('callback')) {
      obj.callback();
    }
  },
  content: function(obj) {
  	const triggerParent = obj.trigger.closest('.canvas-content-block'),
  	      dataContent = triggerParent.getAttribute('data-content'),
  	      isTabContent = document.getElementById('toolbox')
            .previousElementSibling
            .classList
            .contains('forTabs'),
          elementTemplate = obj.data.template();

    const displayToolboxButtons = () => {
      const btns = document.querySelectorAll('#' + obj.id + ' .canvas-add-component [data-action="select-component"]');
      return btns;
    };

    let tmpl, tabContentId, toolboxBtns;

    if (dataContent === 'empty') {
      tmpl = module.exports.renderContentBlock(obj,elementTemplate,undefined);
      this.canvasContainer.insertAdjacentHTML('beforeend', tmpl);
    }
    else {
      if (!isTabContent) {
        tmpl = module.exports.renderContentBlock(obj,elementTemplate,undefined);
        triggerParent.insertAdjacentHTML('afterend',tmpl);
      }
      else {
        const tabContentIn = triggerParent.querySelector('.sf-tab-content.in'),
              tabContentId = tabContentIn.getAttribute('id');

        tmpl = module.exports.renderContentBlock(obj,elementTemplate,tabContentId);
        const subContent = triggerParent.querySelector('.sf-tab-content.in');
        const tabParentId = subContent.getAttribute('id');
        subContent.childNodes.length == 0 ? 
          (subContent.innerHTML = tmpl) : subContent.insertAdjacentHTML('beforeend',tmpl);
      }
    }

    toolboxBtns = displayToolboxButtons();
    obj.callback(toolboxBtns);
  },
  renderContentBlock: function(obj,elementTemplate,tabContentId) {
    const tmpl = `
    <section class="canvas-content-block" id="${obj.id}">
      <div class="canvas-content-config"> 
        <span class="canvas-content-draggable 
          ${typeof tabContentId === 'undefined' ? `canvasDraggableMain` : `canvasDraggableSub_tab-` + 
            tabContentId }"></span>
        ${obj.data.hasOwnProperty('types') ? module.exports.renderOptions(obj) : ''}
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
        ${elementTemplate}
      </div>
      ${ obj.data.hasChildContent ? module.exports.renderAddSubContent() : `` }
      ${ (typeof tabContentId === 'undefined') ? module.exports.renderAddMainContent() : `` }
    </section>`;

    return tmpl;
  },
  renderOptions: function(obj) {
    let opts = '';
    for (let i = 0; i <= obj.data.types.length - 1; i++) {
      opts += `<option value="${obj.data.types[i].ui_value}">${obj.data.types[i].ui_label}</option>`;
    }
    return `<select class="canvas-form-control" name="s-${obj.id}" data-target="snippet-${obj.id}">${opts}</select>`;
  },
  renderAddSubContent: function() {
    const str = `
    <div class="canvas-add-component canvas-add-subcontent">
      <button type="button" class="canvas-btn canvas-btn-xs btn-has-text forTabs" data-action="select-component">
        <i class="icon-plus">&#43;</i> Add Content to this tab
      </button>
    </div>
    `;
    return str;
  },
  renderAddMainContent: function() {
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
  update: function() {
  }
};