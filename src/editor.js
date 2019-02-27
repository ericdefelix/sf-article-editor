import './editor.scss';
import { GetClosestParent, GenerateID, NormaliseHTMLString } from './modules/utils/chromeExtensionUtils';
import ContentBlocks from './modules/ContentBlocks';
import UserInterfaceBuilder from './modules/UserInterfaceBuilder';
import Sortable from '../node_modules/sortablejs/Sortable.min';

let editor = {
	crxID: '',
	ckeditorInstanceId: '',
	instanceHTML: '',
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
		try {
			window.chrome.storage.sync.get(['ckeditorInstanceId'],function(objLocalStorage){
				editor.ckeditorInstanceId = objLocalStorage.ckeditorInstanceId;
				editor.instanceHTML = objLocalStorage.instanceHTML;
				editor.btnSave.setAttribute('data-target',editor.ckeditorInstanceId);
			});

			editor.crxID = window.chrome.runtime.id;
		} catch(e) {
			console.log('Attempting to do a chrome api method. You are in build mode');
		} finally {
			editor.existing_data = [];
			// editor.existing_data = editor.sourceSection.value == '' ? [] : JSON.parse(editor.sourceSection.value);

			this.build_ui();
			this.init_sortable({
				container: document.getElementById('canvasContainer'),
				contentDraggableClass: '.canvasDraggableMain'
			});

			editor.btnPreview.onclick = editor.generate_html;
			editor.btnSave.onclick = editor.save_html;
			editor.toggleView.onchange = editor.html_view;
			editor.btnClose.onclick = editor.close_preview;
		}
	},
	build_ui: function() {
		function replaceString(baseStr, strLookup, strReplacement) {
			return baseStr.replace(strLookup, strReplacement);
		}

		UserInterfaceBuilder.render('canvas', { 
			data: editor.existing_data, 
			trigger: 'auto',
			dependencies: [ContentBlocks,replaceString],
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
		const domID = GenerateID();
		const targetComponentPointer = this.getAttribute('data-ui-label');
		const isAddingFromTab = this.closest('.canvas-add-subcontent');
		const ckeditorBindToElem = ContentBlocks.elems[targetComponentPointer].ckeditorBindToElem;

    let contentData = {};

		UserInterfaceBuilder.render('content', {
			id: domID,
			type: targetComponentPointer,
			data: ContentBlocks.elems[targetComponentPointer],
			trigger: this,
			callback: function(displayToolboxButtons) {
				let containerID;
        const targetSnippetContainer = document.getElementById('snippet-' + domID);
				const attachAttributesForCKEDITOR = (id,headerClass,bodyClass) => {
					const targetContentHeading = document.querySelector('#snippet-' + id + ' .' + headerClass),
								targetContentBody = document.querySelector('#snippet-' + id + ' .' + bodyClass);

					targetContentHeading.contentEditable = true;
					targetContentBody.contentEditable = true;

					targetContentHeading.onblur = editor._bindEvtHeaderInput;
					targetContentBody.id = 'contentEditableBody-' + id;
				};

				if (targetComponentPointer == 'blockQuotes') {
					attachAttributesForCKEDITOR(domID,'blockquote-content-header','blockquote-content-body');
					document.querySelector('[data-target="snippet-'+ domID +'"]').onchange = editor._bindEvtSelectionDropdown;
				}

				if (targetComponentPointer == 'wellContainer') {
					attachAttributesForCKEDITOR(domID,'well-heading','well-body');				
				}

				if (targetComponentPointer == 'genericTabs') {
					const targetTabContent = targetSnippetContainer.querySelectorAll('.tab-content');
					targetTabContent.forEach(function(targtTab,y){
						const targetTabID = targtTab.getAttribute('id');
						editor.init_sortable({
							container: document.getElementById(targetTabID),
							contentDraggableClass: '.canvasDraggableSub_' + targetTabID
						});
					});
				}

				if (targetComponentPointer == 'styledLists' || targetComponentPointer == 'textEditor') {
					targetSnippetContainer.contentEditable = true;
				}

				if (ckeditorBindToElem !== 'none') {
					const containerID = ckeditorBindToElem == 'content' ? 'contentEditableBody-'+ domID : 'snippet-'+ domID;
					editor.init_ckeditor({
						container: containerID,
						value: ContentBlocks.elems[targetComponentPointer].template(),
						config: ContentBlocks.elems[targetComponentPointer].ckeditorConfig
					});
				}

        displayToolboxButtons.forEach(function(btn,index){
          btn.onclick = editor._bindEvtDisplayToolbox;
        });

        contentData['id'] = domID;
        contentData['type'] = targetComponentPointer;

				editor.existing_data.push(contentData);
			}
		});

		UserInterfaceBuilder.render('canvas', {
			data: editor.existing_data,
			dependencies: [],
			trigger: 'user'
		});
	},
	_bindEvtSelectionDropdown: function() {
		const selectedStyle = this.value;
		const targetSnippetContainer = this.getAttribute('data-target');
		const blockquote = document.getElementById(targetSnippetContainer).firstElementChild;

		blockquote.className = 'blockquote';
		blockquote.classList.add('blockquote-' + selectedStyle);
	},
	_bindEvtHeaderInput: function() {
		if (this.textContent == '') this.textContent = 'Click here to edit heading';
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
	generate_html: function() {
		editor.outputPane.style.display = 'block';

		const contentBlocksDom = document.querySelectorAll('#canvasContainer > .canvas-content-block');
		let htmlOutputString = '';
		let htmlData = [];

		if (editor.existing_data.length > 0) {
			contentBlocksDom.forEach((block,b_index) => {
				const snippet = block.querySelector('.canvas-content-snippet');
				const type = snippet.getAttribute('data-component-type');
				const id = block.getAttribute('id');
				const elemChild = snippet.firstElementChild;

				let metadata = {};

				const newContentObj = function(type, id, data) {
					return { type: type, id: id, metadata: data };
				};

				const newTabObj = function(label,id) {
					return { label: label, id: id, content: [] };
				};

				if (elemChild.classList.contains('tabs')) {
					const tabsContent = elemChild.querySelectorAll('.tab-content');
					let tabsHTML = `<div class="tabs">`;

					tabsHTML += snippet.firstElementChild.firstElementChild.innerHTML;

					// Get data from tabs
					metadata = createMetadata(type,elemChild);
					htmlData.push(newContentObj(type, id, metadata));

					tabsContent.forEach((tabcontent,tc_index) => {
						let tabContentBlocksHTML = ``;
						const tabContentBlocks = tabcontent.querySelectorAll('.canvas-content-block');
						const tabSnippets = tabcontent.querySelectorAll('.canvas-content-block .canvas-content-snippet');
						const tabId = tabcontent.getAttribute('id').split('tab-')[1];
						const tabLabel = document.querySelector('.tab-item-link[data-target="tab-'+ tabId +'"]').textContent;


						htmlData[b_index].metadata.subnodes.push(newTabObj(tabLabel,tabId));

						tabSnippets.forEach((tabSnippet,ts_index) => {
							const elemSubChild = tabSnippet.firstElementChild;
							const subchildType = tabSnippet.getAttribute('data-component-type');
							const subchildID = tabContentBlocks[ts_index].getAttribute('id');

							const _tabContentBlocksHTML = (elemSubChild.classList.contains('blockquote') || elemSubChild.classList.contains('well')) ?
								extractHTMLFromInnerCKEDITABLE(elemSubChild) : extractHTML(tabSnippet);

							const submetadata = createMetadata(subchildType,_tabContentBlocksHTML,elemSubChild);

							htmlData[b_index].metadata.subnodes[tc_index].content.push(newContentObj(subchildType, subchildID, submetadata));

							tabContentBlocksHTML += _tabContentBlocksHTML;
						});
						tabsHTML += `<section class="${tabcontent.className}" id="${tabcontent.id}">${tabContentBlocksHTML}</section>`;
					});

					htmlData[b_index].metadata.html = tabsHTML;
					htmlOutputString += tabsHTML + `</div>`;

				}
				else {
					let _htmlOutputString;

					// Get data if an element has a heading and a body
					if (elemChild.classList.contains('blockquote') || elemChild.classList.contains('well')) {
						_htmlOutputString = NormaliseHTMLString(extractHTMLFromInnerCKEDITABLE(elemChild));
						const _heading = NormaliseHTMLString(elemChild.querySelector('h5').textContent);
						const _body =  NormaliseHTMLString(elemChild.querySelector('.cke_editable').innerHTML);

						metadata = createMetadata(type,_htmlOutputString,elemChild);
						htmlOutputString += _htmlOutputString;
					}
					// Get data if an element has no heading
					else {
						_htmlOutputString = NormaliseHTMLString(extractHTML(snippet));
						metadata = createMetadata(type,_htmlOutputString);
						htmlOutputString += _htmlOutputString;
					}

					htmlData.push(newContentObj(type, id, metadata));
				}
			});
		}

		const hiddenInput = htmlData.length > 0 ? `<textarea style="display: none;">${ JSON.stringify(htmlData)}</textarea>` : ``;

		editor.htmlSection.innerHTML = editor.existing_data.length > 0 ? htmlOutputString : '<strong>Nothing to display here.</strong>';
		editor.sourceSection.value = editor.htmlSection.innerHTML + hiddenInput;

		const contentEditableBlockquoteHeadings = document.querySelectorAll('#outputContainer .blockquote-content-header');
		contentEditableBlockquoteHeadings.forEach((heading,h_index) => {
			heading.removeAttribute('contenteditable');
		});

		function createMetadata(componentType, htmlOutputString, elemChild) {
			if (componentType == 'genericTabs') {
				return { subnodes: [], html: '' };
			}
			else {
				if (componentType == 'wellContainer' || componentType == 'blockQuotes') {
					const heading = NormaliseHTMLString(elemChild.querySelector('h5').textContent);
					const body =  NormaliseHTMLString(elemChild.querySelector('.cke_editable').innerHTML);
					return { html: htmlOutputString, variables: [heading,body] };
				}
				else {
					return { html: htmlOutputString };
				}
			}
		}

		function extractHTMLFromInnerCKEDITABLE(elemChild) {
			const clone = elemChild.cloneNode(true);
			const contentEditableBodySnippet = clone.querySelector('.cke_editable');
			const contentEditableBodySnippetClassName = contentEditableBodySnippet.classList[0];
			const contentEditableBodySnippetData = extractHTML(contentEditableBodySnippet);
			contentEditableBodySnippet.remove();

			const contentEditableBodySnippetHTML = `
				<div class="${contentEditableBodySnippetClassName}">${contentEditableBodySnippetData}</div>`;

			clone.lastElementChild.insertAdjacentHTML('beforeend',contentEditableBodySnippetHTML);

			return clone.outerHTML;
		}

		function extractHTML(snippet) {
			if (snippet.classList.contains('cke_editable')) {
				const ckeditorInstance = snippet.getAttribute('id');
				return CKEDITOR.instances[ckeditorInstance].getData();
			}
			else {
				return snippet.innerHTML;
			}
		}

		console.log(htmlData);
	},
	save_html: function() {
		editor.generate_html();
		editor.outputPane.style.display = 'none';

		const request = {
			method: 'insertToCKEDITOR',
			origin: window.location.origin,
			crxid: editor.crxID,
			data: { 
				html: editor.sourceSection.value,
				ckeditorIntanceId: this.getAttribute('data-target')
			}
		};

		try {
			window.chrome.runtime.sendMessage(editor.crxID, request);
		} catch(e) {
			// statements
			console.log('Attempting to do a chrome api method. Page origin is not via chrome extension');
		}
	},
	run: function() {
		this.init();
	}
};

editor.run();