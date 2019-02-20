module.exports = {
	elems: {
		'textEditor' : {
			ui_label: 'Text Editor',
			template: function(config) {
				const tmpl = `
					<span>Click here to start editing</span>
				`;
				return tmpl;
			},
			hasChildContent: false,
			isInlineCKEDITOR: true,
			ckeditorConfig: {
			}
		},
		'styledLists' : {
			ui_label: 'Styled Lists',
			template: function(config) {
				const dflt = typeof config === 'undefined' ? 'ol' : config;

				const tmpl = `
					<${dflt} class="list-bullet-circular">
						<li>Click here to start editing list</li>
						<li>Or paste content here.</li>
					</${dflt}>`;

				return tmpl;
			},
			hasChildContent: false,
			isInlineCKEDITOR: true,
			ckeditorConfig: {
				toolbar: [
					{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
					{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript' ] },
					{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList'] },
					{ name: 'links', items: [ 'Link', 'Unlink' ] }
				],
				copyFormatting_allowRules: false,
	    	extraAllowedContent: 'ol(list-bullet-circular);ul(list-bullet-circular)',
	    	disaAllowedContent: 'h1 h2 h3 h4 p span blockquote img embed',
	    	on: {
		  		instanceReady: function(evt) {
				    evt.editor.on('beforeCommandExec', function(event){
				    	for (key in event.data) {
				    		if (key === 'name') {
				    			const name = event.data[key];
									if(name == 'bulletedlist' || name == 'numberedlist') {
										const editor = evt.editor;
										editor.focus();
										editor.document.$.execCommand('SelectAll', false, null);
									}
				    		}
				    	}
			      }, null, null, 100);

			      evt.editor.on('afterCommandExec', function(event){
				    	for (key in event.data) {
				    		if (key === 'name') {
				    			const name = event.data[key];
									if(name == 'bulletedlist' || name == 'numberedlist') {
										const listParent = evt.editor.getSelection().getStartElement().getParent().$;
										const lpNodeName = listParent.nodeName;

										if (lpNodeName === 'OL' || lpNodeName === 'UL') {
											listParent.classList.add('list-bullet-circular');
											// evt.editor.getSelection().removeAllRanges();
										}
									}
				    		}
				    	}
			      }, null, null, 100);
		  		}
	    	}
			}
		},
		'blockQuotes' : {
			ui_label: 'Block Quotes',
			types: [
				{ ui_label: 'Info', ui_value: 'info' },
				{ ui_label: 'Tip', ui_value: 'tip' },
				{ ui_label: 'Attention', ui_value: 'alert' }
			],
			template: function(config) {
				const dflt = typeof config === 'undefined' ? 'info' : config;

				const tmpl = `
				<div class="blockquote blockquote-${dflt}" role="blockquote">
					<span class="blockquote-addon">
						<i class="blockquote-icon"></i>
					</span>
					<div class="blockquote-content">
						<h5 class="blockquote-content-header">Click here to edit header</h5>
						<div class="blockquote-content-body">
							<p>Click here to edit/paste content.</p>
						</div>
					</div>
				</div>`;

				return tmpl;
			},
			hasChildContent: false,
			isInlineCKEDITOR: true,
			ckeditorConfig: {
				toolbar: [
					{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteFromWord', '-', 'Undo', 'Redo' ] },
					{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat' ] },
					{ name: 'links', items: [ 'Link', 'Unlink' ] }
				],
	    	disaAllowedContent: 'h1 h2 h3 h4 p span blockquote img embed'
			}
		},
		'genericTabs' : {
			ui_label: 'Generic Tabs',
			template: function(config) {
				let navTabItems = '', navTabSections = '';
				let subnodes = [];

				const generateID = function() {
					return Math.floor(Math.random()*90000) + 10000;
				};

				const emptyStateSubnodes = [
					{ label: 'Desktop', id: 'tab-' + generateID(), content: [] },
					{ label: 'Web', id: 'tab-' + generateID(), content: [] },
					{ label: 'Mobile', id: 'tab-' + generateID(), content: [] }
				];
 
				subnodes = typeof config === 'undefined' ? emptyStateSubnodes : config.data.subnodes;

				for (let i = 0; i <= emptyStateSubnodes.length-1; i++) {
					const id = subnodes[i].id, label = subnodes[i].label;

					navTabItems += `
						<li class="tab-item${ i == 0 ? ' active' : ''}">
							<a href="#" class="tab-item-link" data-target="${id}">${label}</a>
						</li>
					`;
					navTabSections += `<section class="tab-content${ i == 0 ? ' in' : ''}" id="${id}"></section>`;
				}

				const tmpl = `
					<div class="tabs">
						<div class="tabs-bar"><ul class="tab-nav">${navTabItems}</ul></div>${navTabSections}
					</div>
				`;

				return tmpl;
			},
			isInlineCKEDITOR: false,
			hasChildContent: true
		}
	},
  getTemplate: function(elemType,config) {
  	const template = this.elems[elemType].template(config);
    return template;
  }
};