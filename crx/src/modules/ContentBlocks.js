module.exports = {
	elems: {
		'textEditor' : {
			ui_label: 'Text Editor',
			template: function (config) {
				const html = typeof config !== 'undefined' ? config.value : '<p>Click here to start editing</p>';
				const tmpl = `<div class="sf-editor-content">${html}</div>`;
				return tmpl;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'container',
			contentEditorConfig: {
        plugins: 'lists link image table imagetools',
				toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist'
			}
		},
		'styledLists' : {
			ui_label: 'Styled Lists',
			template: function(config) {
				const listType = typeof config === 'undefined' ? 'ol' : config;

				const tmpl = `
					<${listType} class="sf-list-bullet-circular">
						<li>Click here to start editing list</li>
						<li>Or paste content here.</li>
					</${listType}>`;

				return tmpl;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'container',
			contentEditorConfig: {
				plugins: 'lists link image table imagetools',
				toolbar: 'undo redo | numlist bullist | link image imageupload table | bold italic strikethrough'
			}
		},
		'blockQuotes' : {
			ui_label: 'Block Quotes',
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
			template: function(config) {
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

				// <i class="blockquote-icon"></i> taken out and replaced by SVG instead of font
				const tmpl = `
				<div class="sf-blockquote sf-blockquote-${setConfig.cssClass()}" role="blockquote">
					<div class="sf-blockquote-addon"></div>
					<div class="sf-blockquote-content">
						<h5 class="sf-blockquote-content-header">${setConfig.header()}</h5>
						<div class="sf-blockquote-content-body">
							${setConfig.body()}
						</div>
					</div>
				</div>`;
				return tmpl;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'content',
			contentEditorConfig: {
        plugins: 'link image table',
        toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table',
			}
		},
		'wellContainer' : {
			ui_label: 'Generic Box',
			template: function(config) {
				const tmpl = `
					<div class="sf-well">
						<h5 class="sf-well-heading">Click here to edit heading</h5>
						<div class="sf-well-body"><p>Click here to edit/paste content.</p></div>
					</div>`;

				return tmpl;
			},
			hasChildContent: false,
			contentEditorBindToElem: 'content',
			contentEditorConfig: {
        plugins: 'link image table',
        toolbar: 'undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table',
			}
		},
		'genericTabs' : {
			ui_label: 'Generic Tabs',
			template: function(config) {
				let navTabItems = '', navTabSections = '';
				let subnodes = [];

				const generateID = function() { return Math.floor(Math.random()*90000) + 10000; };
				const emptyStateSubnodes = [
					{ label: 'Desktop', id: generateID(), content: [] },
					{ label: 'Web', id: generateID(), content: [] },
					{ label: 'Mobile', id: generateID(), content: [] }
				];

				const hasConfig = typeof config !== 'undefined';
 
				subnodes = !hasConfig ? emptyStateSubnodes : config.subnodes;

				for (let i = 0; i <= subnodes.length-1; i++) {
					const id = subnodes[i].id, label = subnodes[i].label;

					navTabItems += `
						<li class="sf-tab-item${ i == 0 ? ' active' : ''}">
							<span class="sf-tab-item-link" id="target_tab-${id}">${label}</span>
						</li>
					`;

					navTabSections += `<div class="sf-tab-content${ i == 0 ? ' in' : ''}" id="tab-${id}">${ hasConfig ? '{{ tab-'+ id +' }}' : '' }</div>`;
				}

				const tmpl = `
					<div class="sf-tabs">
						<div class="sf-tabs-bar"><ul class="sf-tab-nav">${navTabItems}</ul></div>${navTabSections}
					</div>
				`;

				return tmpl;
			},
			contentEditorBindToElem: 'none',
			hasChildContent: true
		}
	},
	keywords: ['sf-blockquote', 'sf-list-bullet-circular', 'sf-well', 'sf-tabs', 'sf-editor-content'],
	keyword_map: {
		'sf-blockquote' : 'blockQuotes',
		'sf-list-bullet-circular' : 'styledLists',
		'sf-well' : 'wellContainer',
		'sf-tabs' : 'genericTabs',
		'sf-editor-content' : 'textEditor'
	},
  getTemplate: function(elemType,config) {
  	const template = this.elems[elemType].template(config);
    return template;
  }
};