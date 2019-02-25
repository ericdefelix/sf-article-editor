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
  	const elementCount = obj.data.length;

  	if (obj.trigger == 'auto') {
			let canvasInitHTML = '';
			canvasInitHTML = elementCount > 0 ? renderExistingData() : renderEmptyState();
			this.canvasContainer.innerHTML = canvasInitHTML;
			obj.callback();
  	}

  	if (obj.trigger == 'user') {
  		if (elementCount == 1) {
  			const emptyStateContainer = document.querySelectorAll('[data-content="empty"]');
  			const toolbox = document.getElementById('toolbox');

  			toolbox.parentNode.removeChild(toolbox);
  			this.canvasContainer.removeChild(emptyStateContainer[0]);
  			this.canvasContainer.appendChild(toolbox);
  		}
  	}

  	function renderEmptyState() {
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
  	}

  	function renderExistingData() {
  		let tmpl = '';
  		return tmpl;
  	}
  },
  content: function(obj) {
  	const triggerParent = obj.trigger.closest('.canvas-content-block');
  	const dataContent = triggerParent.getAttribute('data-content');
  	const isTabContent = document.getElementById('toolbox').previousElementSibling.classList.contains('forTabs');
    const elementTemplate = obj.data.template();

  	const tmpl = `
  	<section class="canvas-content-block" id="${obj.id}">
			<div class="canvas-content-config"> 
				<span class="canvas-content-draggable 
          ${!isTabContent ? `canvasDraggableMain` : `canvasDraggableSub_` + 
            triggerParent.querySelector('.tab-content.in').getAttribute('id') }"></span>
				${obj.data.hasOwnProperty('types') ? renderOptions() : ''}
				<button class="canvas-btn canvas-btn-xs" data-target="${obj.id}">
					<i class="icon-delete"></i> Remove
				</button>
			</div>
			<div class="canvas-content-snippet" id="snippet-${obj.id}" data-component-type="${obj.type}">
        ${elementTemplate}
      </div>
			${ obj.data.hasChildContent ? renderAddSubContent() : `` }
			${ !isTabContent ?  renderAddMainContent() : ''}
		</section>`;

    if (dataContent === 'empty') {
      this.canvasContainer.insertAdjacentHTML('beforeend', tmpl);
    }
    else {
      if (!isTabContent) {
        triggerParent.insertAdjacentHTML('afterend',tmpl);
      }
      else {
        const subContent = triggerParent.querySelector('.tab-content.in');
        const tabParentId = subContent.getAttribute('id');
        subContent.childNodes.length == 0 ? 
          (subContent.innerHTML = tmpl) : subContent.insertAdjacentHTML('beforeend',tmpl);
      }
    }

    const btns = displayToolboxButtons();
    obj.callback(btns);

    // Fxns
		function renderOptions() {
			let opts = '';
			for (let i = 0; i <= obj.data.types.length - 1; i++) {
				opts += `<option value="${obj.data.types[i].ui_value}">${obj.data.types[i].ui_label}</option>`;
			}
			return `<select class="canvas-form-control" name="s-${obj.id}" data-target="snippet-${obj.id}">${opts}</select>`;
		}

  	function renderAddSubContent() {
  		const str = `
			<div class="canvas-add-component canvas-add-subcontent">
				<button type="button" class="canvas-btn canvas-btn-xs btn-has-text forTabs" data-action="select-component">
					<i class="icon-plus">&#43;</i> Add Content to this tab
				</button>
			</div>
  		`;
			return str;
  	}

  	function renderAddMainContent() {
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
  	}

		function displayToolboxButtons() {
			const btns = document.querySelectorAll('#' + obj.id + ' .canvas-add-component [data-action="select-component"]');
			return btns;
		}
  },
  update: function() {
  }
};