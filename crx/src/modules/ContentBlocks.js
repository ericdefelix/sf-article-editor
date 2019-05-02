import { GenerateTabID } from './utils/chromeExtensionUtils';

const ContentBlocks = {
	elems: {
		'textEditor' : {
			ui_label: 'Text',
			template: (config) => {
				const html = typeof config !== 'undefined' ? config.value : '<p>Click here to start editing</p>';
				return `<div class="sf-editor-content">${html}</div>`;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'container',
			cssClass: 'sf-editor-content',
			contentEditorConfig: {
        plugins: 'lists link image table imagetools',
				toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist'
			}
		},
		'genericTabs' : {
			ui_label: 'Tabs',
			template: (config) => {
				let
					navTabItems = '',
					navTabSections = '',
					subnodes = [];

				const
					hasConfig = typeof config !== 'undefined',
					emptyStateSubnodes = Array.from({ length: 5 }, (e, i) => ({ label: `Tab ${i + 1}`, id: GenerateTabID(), content: [] }));
				
				subnodes = !hasConfig ? emptyStateSubnodes : config.subnodes;

				subnodes.forEach((subnode, index) => {
					navTabItems += `
						<li class="sf-tab-item${ index == 0 ? ' active' : ''}">
							<span class="sf-tab-item-link" id="target_tab-${subnode.id}">${subnode.label}</span>
						</li>`;

					navTabSections += `
						<div class="sf-tab-content${index == 0 ? ' in' : ''}" 
							id="tab-${subnode.id}">${hasConfig ? '{{ tab-' + subnode.id + ' }}' : ''}
						</div>`;
				});

				return `
					<div class="sf-tabs">
						<div class="sf-tabs-bar"><ul class="sf-tab-nav">${navTabItems}</ul></div>${navTabSections}
					</div>`;
			},
			contentEditorBindToElem: 'none',
			cssClass: 'sf-tabs',
			hasChildContent: true
		},
		'styledLists': {
			ui_label: 'Numbering',
			template: (config) => {
				const listType = typeof config === 'undefined' ? 'ol' : config;

				return `
					<${listType} class="sf-list-bullet-circular">
						<li>Click here to start editing list</li>
						<li>Or paste content here.</li>
					</${listType}>`;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'container',
			cssClass: 'sf-list-bullet-circular',
			contentEditorConfig: {
				plugins: 'lists link image table imagetools',
				toolbar: 'undo redo | numlist bullist | link image imageupload table | bold italic strikethrough'
			}
		},
		'blockQuotes': {
			ui_label: 'Tips',
			types: [
				{
					ui_label: 'Info',
					ui_value: 'info'
				},
				{
					ui_label: 'Tip',
					ui_value: 'tip'
				},
				{
					ui_label: 'Attention',
					ui_value: 'alert'
				}
			],
			template: (config) => {
				let setConfig = {
					cssClass: () => {
						const cssClass = typeof config === 'undefined' ? 'info' : 'info';
						return cssClass;
					},
					header: () => {
						const header = typeof config === 'undefined' ? 'Click here to edit heading' : config.variables[0];
						return header;
					},
					body: () => {
						const body = typeof config === 'undefined' ? 'Click here to edit/paste content' : config.variables[1];
						return body;
					}
				};

				return `
				<div class="sf-blockquote sf-blockquote-${setConfig.cssClass()}" role="blockquote">
					<div class="sf-blockquote-addon"></div>
					<div class="sf-blockquote-content">
						<h5 class="sf-blockquote-content-header">${setConfig.header()}</h5>
						<div class="sf-blockquote-content-body">
							${setConfig.body()}
						</div>
					</div>
				</div>`;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'content',
			cssClass: 'sf-blockquote',
			contentEditorConfig: {
				plugins: 'link image table',
				toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table',
			}
		},
		'wellContainer': {
			ui_label: 'Info',
			template: (config) => {
				return `
					<div class="sf-well">
						<h5 class="sf-well-heading">Click here to edit heading</h5>
						<div class="sf-well-body"><p>Click here to edit/paste content.</p></div>
					</div>`;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'content',
			cssClass: 'sf-well',
			contentEditorConfig: {
				plugins: 'link image table',
				toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table',
			}
		},
	},
  getTemplate: (elemType,config) => {
		return ContentBlocks.elems[elemType].template(config);
	},
	keywords: ['sf-blockquote', 'sf-list-bullet-circular', 'sf-well', 'sf-tabs', 'sf-editor-content'],
	keyword_map: {
		'sf-blockquote' : 'blockQuotes',
		'sf-list-bullet-circular' : 'styledLists',
		'sf-well' : 'wellContainer',
		'sf-tabs' : 'genericTabs',
		'sf-editor-content' : 'textEditor'
	}
};
export default ContentBlocks;