import './editor.scss';
import { GetClosestParent, GenerateID } from './modules/utils/chromeExtensionUtils';
import ContentBlocks from './modules/ContentBlocks';
import UserInterfaceBuilder from './modules/UserInterfaceBuilder';
import Sortable from '../node_modules/sortablejs/Sortable.min';

let editor = {
	outputPane: 		document.getElementById('outputContainer'),
	htmlSection: 		document.getElementById('htmlOutputContainer'),
	sourceSection: 	document.getElementById('viewSourcePreview'),
	btnPreview: 		document.getElementById('btnPreview'),
	btnSave: 				document.getElementById('btnSave'),
	btnClose: 			document.getElementById('btnCloseOutputContainer'),
	toggleView: 		document.getElementById('outputContainerToggleView'),
	existing_data: [],
	toolbox: undefined,
	init: function() {
		this.build_ui();
		this.init_sortable({
			container: document.getElementById('canvasContainer'),
			contentDraggableClass: '.canvasDraggableMain'
		});

		editor.btnPreview.onclick = editor.preview;
		editor.toggleView.onchange = editor.html_view;
		editor.btnClose.onclick = editor.close_preview;
		editor.btnSave.onclick = editor.save_html;
	},
	build_ui: function() {
		UserInterfaceBuilder.render('canvas', { 
			data: editor.existing_data, 
			trigger: 'auto',
			callback: function() {
				UserInterfaceBuilder.render('toolbox', ContentBlocks.elems);

				const btnsAddComponent = document.querySelectorAll('[data-action="add-component"]');
				const btnsSelectComponent = document.querySelectorAll('[data-action="select-component"]');

				// This is where we bind each element event listeners to display the toolbox
				for (let i = 0; i <= btnsSelectComponent.length - 1; i++) {
					const btnObj = btnsSelectComponent[i];
					btnObj.onclick = editor._bindEvtDisplayToolbox;
				}

				// This is where we bind each element event listeners to actually add components
				for (let i = 0; i <= btnsAddComponent.length - 1; i++) {
					const btnObj = btnsAddComponent[i];
					btnObj.onclick = editor._bindEvtAddComponent;
				}

				document.addEventListener('click', function (event) {
					const parent = GetClosestParent(event.target, '.canvas-add-component');
					if (parent === null) {
						toolbox.classList.remove('in');
					}
				}, false);

				// editor.btnPreview.disabled = editor.existing_data.length == 0 ? true : false;
			}
		});
	},
	_bindEvtDisplayToolbox: function() {
		editor.toolbox = document.getElementById('toolbox');
		toolbox.classList.remove('in');
		toolbox.style.display = 'block';

		this.parentElement.appendChild(toolbox);
		const toolboxWidth = toolbox.offsetWidth;
		const isAddingFromTab = this.parentElement.classList.contains('canvas-add-subcontent');

		toolbox.style.left = isAddingFromTab ? '0' : 'calc(50% - '+ (toolboxWidth / 2 + 4) +'px)';
		toolbox.classList.contains('in') ? toolbox.classList.remove('in') : toolbox.classList.add('in');
		toolbox.focus();
	},
	_bindEvtAddComponent: function() {
		const targetComponentPointer = this.getAttribute('data-ui-label');
		const domID = GenerateID();
		const isAddingFromTab = this.closest('.canvas-add-subcontent');
		const hasCKEDITOR = ContentBlocks.elems[targetComponentPointer].isInlineCKEDITOR;

		UserInterfaceBuilder.render('content', {
			id: domID,
			data: ContentBlocks.elems[targetComponentPointer],
			trigger: this,
			hasCKEDITOR: hasCKEDITOR,
			callback: function(displayToolboxButtons) {
				displayToolboxButtons.forEach(function(btn,index){
					btn.onclick = editor._bindEvtDisplayToolbox;
				});

				const targetSnippet = document.getElementById('snippet-' + domID);

				if (targetComponentPointer == 'genericTabs') {
					const targetTabContent = targetSnippet.querySelectorAll('.tab-content');
					targetTabContent.forEach(function(targtTab,y){
						const targetTabID = targtTab.getAttribute('id');

						editor.init_sortable({
							container: document.getElementById(targetTabID),
							contentDraggableClass: '.canvasDraggableSub_' + targetTabID
						});
					});
				}

				if (targetComponentPointer == 'blockQuotes') {
					const blockquoteStyleSelector = document.querySelector('[data-target="snippet-'+ domID +'"]');
					const blockquoteHeading = document.querySelector('#snippet-' + domID + ' .blockquote-content-header');
					const blockquoteBody = document.querySelector('#snippet-' + domID + ' .blockquote-content-body');

					blockquoteStyleSelector.onchange = editor._bindEvtSelectionDropdown;
					blockquoteHeading.onblur = editor._bindEvtBlockquoteHeaderInput;
					blockquoteHeading.contentEditable = true;
					blockquoteBody.contentEditable = true;
					blockquoteBody.id = 'contentEditableBody-' + domID;
				}

				if (hasCKEDITOR) {
					const containerID = (targetComponentPointer == 'blockQuotes' || targetComponentPointer == 'wellContainers') ?
						'contentEditableBody-'+ domID : 'snippet-'+ domID;

					if (targetComponentPointer == 'styledLists' || targetComponentPointer == 'textEditor') {
						targetSnippet.contentEditable = true;
					}

					editor.init_ckeditor({
						container: containerID,
						value: ContentBlocks.elems[targetComponentPointer].template(),
						config: ContentBlocks.elems[targetComponentPointer].ckeditorConfig
					});
				}

				editor.existing_data.push({ 
					id: domID, 
					type: targetComponentPointer
				});

				console.log(editor.existing_data);
			}
		});

		UserInterfaceBuilder.render('canvas', {
			data: editor.existing_data, 
			trigger: 'user'
		});
	},
	_bindEvtSelectionDropdown: function() {
		const selectedStyle = this.value;
		const targetSnippet = this.getAttribute('data-target');
		const blockquote = document.getElementById(targetSnippet).firstElementChild;

		blockquote.className = 'blockquote';
		blockquote.classList.add('blockquote-' + selectedStyle);
	},
	_bindEvtBlockquoteHeaderInput: function() {
		if (this.textContent == '') this.textContent = 'Click here to edit header';
	},
	init_sortable: function(config) {
		const sortableConfig = {
			sort: true,
			touchStartThreshold: 5,
			filter: '[data-content="empty"]',
			chosenClass: 'canvas-content-chosen',
			ghostClass: 'canvas-content-ghost',
			dragClass: 'canvas-content-dragging',
			animation: 300,
			easing: 'cubic-bezier(1, 0, 0, 1)',
			handle: config.contentDraggableClass,
			direction: 'vertical',
			onEnd: editor.update_list
		};

		new Sortable(config.container, sortableConfig);
	},
	init_ckeditor: function(ckeditorAppConfig) {
    CKEDITOR.inline(ckeditorAppConfig.container, ckeditorAppConfig.config);
	},
	html_view: function() {
		const view = this.value;
		editor.sourceSection.style.display = view == 'source' ? 'block' : 'none';
		editor.htmlSection.style.display = view == 'html' ? 'block' : 'none';
	},
	close_preview: function() {
		editor.outputPane.style.display = 'none';
	},
	preview: function() {
		editor.outputPane.style.display = 'block';

		const contentBlocksDom = document.querySelectorAll('#canvasContainer > .canvas-content-block');
		let htmlOutputString = '';

		if (editor.existing_data.length > 0) {
			contentBlocksDom.forEach((block,b_index) => {
				const snippet = block.querySelector('.canvas-content-snippet');
				const elemChild = snippet.firstElementChild;

				if (elemChild.classList.contains('tabs')) {
					const tabsContent = elemChild.querySelectorAll('.tab-content');
					let tabsHTML = `<div class="tabs">`;

					tabsHTML += snippet.firstElementChild.firstElementChild.innerHTML;

					tabsContent.forEach((tabcontent,tc_index) => {
						let tabContentBlocksHTML = ``;
						const tabSnippets = tabcontent.querySelectorAll('.canvas-content-block .canvas-content-snippet');

						tabSnippets.forEach((tabSnippet,ts_index) => {
							const elemSubChild = tabSnippet.firstElementChild;
							tabContentBlocksHTML += (elemSubChild.classList.contains('blockquote') || elemSubChild.classList.contains('well')) ?
								extractHTMLFromInnerCKEDITABLE(elemSubChild) : extractHTML(tabSnippet);
						});

						tabsHTML += `<section class="${tabcontent.className}" id="${tabcontent.id}">${tabContentBlocksHTML}</section>`;
					});

					htmlOutputString += tabsHTML + `</div>`;
				}
				else if (elemChild.classList.contains('blockquote') || elemChild.classList.contains('well')) {
					htmlOutputString += extractHTMLFromInnerCKEDITABLE(elemChild);
				}
				else {
					htmlOutputString += extractHTML(snippet);
				}
			});
		}

		editor.htmlSection.innerHTML = editor.existing_data.length > 0 ? htmlOutputString : '<strong>Nothing to display here.</strong>';
		editor.sourceSection.value = editor.htmlSection.innerHTML;

		const contentEditableBlockquoteHeadings = document.querySelectorAll('#outputContainer .blockquote-content-header');
		contentEditableBlockquoteHeadings.forEach((heading,h_index) => {
			heading.removeAttribute('contenteditable');
		});

		function extractHTMLFromInnerCKEDITABLE(elemChild) {
			const clone = elemChild.cloneNode(true);
			const contentEditableBodySnippet = clone.querySelector('.cke_editable');
			const contentEditableBodySnippetClassName = contentEditableBodySnippet.classList[0];
			const contentEditableBodySnippetData = extractHTML(contentEditableBodySnippet);
			contentEditableBodySnippet.remove();

			const contentEditableBodySnippetHTML = `
						<section class="${contentEditableBodySnippetClassName}">${contentEditableBodySnippetData}</section`;

			clone.lastElementChild.insertAdjacentHTML('beforeend',contentEditableBodySnippetHTML);

			return clone.outerHTML;
		}

		function extractHTML(snippet) {
			let innerHTML = '';
			if (snippet.classList.contains('cke_editable')) {
				const ckeditorInstance = snippet.getAttribute('id');
				innerHTML = CKEDITOR.instances[ckeditorInstance].getData();
			}
			else {
				innerHTML = snippet.innerHTML;
			}
			return innerHTML;
		}
	},
	save_html: function() {
		const config = {
			method: 'save',
			origin: window.location.origin,
			data: { html: editor.sourceSection.value }
		};

		window.postMessage(config, window.location.origin);
		console.log(config);
	},
	run: function() {
		this.init();
	}
};

editor.run();