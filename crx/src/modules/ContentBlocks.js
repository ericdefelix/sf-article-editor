import { GenerateTabID } from './utils/chromeExtensionUtils';
import TextContent from './components/text-content';
// import { Accordion } from './components/accordion';
// import { StyledLists } from './components/styled-lists';
// import { TextContent } from './components/text-content';
// import { Tips } from './components/blockquotes';
// import { Info } from './components/tabs';



const ContentWithHeaderBodyTextConfig = {
	cssClass: (config) => {
		return typeof config === 'undefined' ? 'info' : config.ui_value;
	},
	header: (config) => {
		return typeof config === 'undefined' ? 'Click here to edit heading' : config.header;
	},
	body: (config) => {
		return typeof config === 'undefined' ? 'Click here to edit/paste content' : config.body;
	}
};

const ContentBlocks = {
	components: {
		TextContent
		// Accordion, StyledLists, TextContent, Tips, Info
	},
	elems: {
		'textEditor' : {
			ui_label: 'Text',
			render: () => {
				// const html = typeof config !== 'undefined' ? config.value : '<p>Click here to start editing</p>';
				return `<div class="sf-editor-content"><p>Click here to start editing</p></div>`;
			},
			hasChildContent: false,
			hasHeaderBodyText: false,
			contentEditorBindToElem: 'container',
			cssClass: 'sf-editor-content',
			contentEditorConfig: {
        plugins: 'lists link image table imagetools',
				toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist'
			}
		},
		'genericTabs' : {
			ui_label: 'Tabs',
			render: (config) => {
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
			hasChildContent: true,
			hasHeaderBodyText: false
		},
		'genericAccordion': {
			ui_label: 'Accordion',
			render: (config) => {
			
				return `Accordion`;
			},
			contentEditorBindToElem: 'none',
			cssClass: 'sf-accordion',
			hasChildContent: true,
			hasHeaderBodyText: false
		},
		'styledLists': {
			ui_label: 'Numbering',
			render: (config) => {
				const listType = typeof config === 'undefined' ? 'ol' : config;

				return `
					<${listType} class="sf-list-bullet-circular">
						<li>Click here to start editing list</li>
						<li>Or paste content here.</li>
					</${listType}>`;
			},
			hasChildContent: false,
			hasHeaderBodyText: false,
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
			render: (config) => {
				return `
					<div class="sf-blockquote sf-blockquote-${ContentWithHeaderBodyTextConfig.cssClass(config)}" role="blockquote">
						<div class="sf-blockquote-addon"></div>
						<div class="sf-blockquote-content">
							<h5 class="sf-blockquote-content-header">${ContentWithHeaderBodyTextConfig.header(config)}</h5>
							<div class="sf-blockquote-content-body">
								${ContentWithHeaderBodyTextConfig.body(config)}
							</div>
						</div>
					</div>`;
			},
			hasChildContent: false,
			hasHeaderBodyText: true,
			contentEditorBindToElem: 'content',
			cssClass: 'sf-blockquote',
			contentEditorConfig: {
				plugins: 'link image table',
				toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table',
			}
		},
		'wellContainer': {
			ui_label: 'Info',
			render: (config) => {
				return `
					<div class="sf-well">
						<h5 class="sf-well-heading">${ContentWithHeaderBodyTextConfig.header(config)}</h5>
						<div class="sf-well-body">${ContentWithHeaderBodyTextConfig.body(config)}</div>
					</div>`;
			},
			hasChildContent: false,
			hasHeaderBodyText: true,
			contentEditorBindToElem: 'content',
			cssClass: 'sf-well',
			contentEditorConfig: {
				plugins: 'link image table',
				toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table',
			}
		},
	},
  getrender: (elemType,config) => {
		return ContentBlocks.elems[elemType].template(config);
	}
};


export default ContentBlocks;