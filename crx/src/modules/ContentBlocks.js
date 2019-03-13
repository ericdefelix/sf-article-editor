module.exports = {
	elems: {
		'textEditor' : {
			ui_label: 'Text Editor',
			template: function (config) {
				const html = typeof config !== 'undefined' ? config.value : '<span>Click here to start editing</span>';
				const tmpl = html;
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
					<${listType} class="list-bullet-circular">
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
					ui_value: 'info',
					svg: `<svg x="0px" y="0px"
									width="100%" height="100%" viewBox="0 0 56 56" style="enable-background:new 0 0 56 56;" xml:space="preserve">
									<g fill="#0060AC">
										<path d="M27.781,21.171c0.811,0,1.513-0.3,2.105-0.898s0.89-1.324,0.89-2.175s-0.294-1.578-0.882-2.183s-1.292-0.906-2.113-0.906
											s-1.528,0.302-2.121,0.906s-0.889,1.332-0.889,2.183s0.296,1.576,0.889,2.175S26.96,21.171,27.781,21.171z M28,0
											C12.536,0,0,12.536,0,28s12.536,28,28,28s28-12.536,28-28S43.464,0,28,0z M28,54C13.641,54,2,42.359,2,28S13.641,2,28,2
											s26,11.641,26,26S42.359,54,28,54z M31.566,39.338c-0.283-0.135-0.502-0.339-0.653-0.613c-0.152-0.273-0.229-0.606-0.229-0.999
											V24.395l-0.228-0.252l-7.449,0.437v1.226c0.304,0.033,0.641,0.112,1.011,0.235s0.646,0.252,0.828,0.386
											c0.243,0.18,0.446,0.417,0.608,0.714s0.243,0.641,0.243,1.032v9.772c0,0.414-0.065,0.747-0.197,0.999s-0.36,0.445-0.685,0.579
											c-0.183,0.079-0.4,0.135-0.653,0.168c-0.254,0.033-0.512,0.062-0.775,0.084V41h9.608v-1.226c-0.264-0.033-0.518-0.089-0.761-0.168
											C31.992,39.528,31.77,39.438,31.566,39.338z"/>
									</g>
								</svg>`
				},
				{ 
					ui_label: 'Tip', 
					ui_value: 'tip',
					svg: `<svg x="0px" y="0px"
									 width="100%" height="100%" viewBox="0 0 36 56" style="enable-background:new 0 0 36 56;" xml:space="preserve">
									<g fill="#43AE33">
										<path d="M24,46H12c-0.553,0-1,0.448-1,1c0,0.553,0.447,1,1,1h12c0.553,0,1-0.447,1-1C25,46.448,24.553,46,24,46z M22,50h-8
											c-0.553,0-1,0.448-1,1c0,0.553,0.447,1,1,1h8c0.553,0,1-0.447,1-1C23,50.448,22.553,50,22,50z M19,54h-2c-0.553,0-1,0.447-1,1
											s0.447,1,1,1h2c0.553,0,1-0.447,1-1S19.553,54,19,54z M36,19C36,8.507,27.941,0,18,0S0,8.507,0,19
											c0,7.919,4.592,14.7,11.116,17.555C11.048,36.69,11,36.838,11,37v2c0,0.553,0.447,1,1,1h12c0.553,0,1-0.447,1-1v-2
											c0-0.162-0.048-0.31-0.116-0.445C31.408,33.7,36,26.919,36,19z M23,35.142V38H13v-2.858C6.614,32.909,2,26.532,2,19
											C2,9.611,9.163,2,18,2s16,7.611,16,17C34,26.532,29.386,32.909,23,35.142z M24,42H12c-0.553,0-1,0.448-1,1c0,0.553,0.447,1,1,1h12
											c0.553,0,1-0.447,1-1C25,42.448,24.553,42,24,42z"/>
									</g>
								</svg>`
				},
				{ 
					ui_label: 'Attention', 
					ui_value: 'alert',
					svg: `<svg width="130px" height="130px" viewBox="0 0 132 130">
							    <g stroke="none" stroke-width="1" fill="#BE332A">
										<path d="M66,0 C29.58474,0 0,29.1364864 0,65 C0,100.863514 29.58474,130 66,130 C102.41526,130 132,100.863514 132,65 C132,29.1364864 102.41526,0 66,0 Z M66,5.90909091 C99.17262,5.90909091 126,32.3299955 126,65 C126,97.6700045 99.17262,124.090909 66,124.090909 C32.82738,124.090909 6,97.6700045 6,65 C6,32.3299955 32.82738,5.90909091 66,5.90909091 Z M62.4375,33.4232955 C61.5375,33.4232955 61.21875,33.9403409 61.21875,34.53125 L61.21875,74.4176136 C61.21875,75.3039773 61.8375,75.6178977 62.4375,75.6178977 L69.28125,75.6178977 C70.18125,75.6178977 70.5,75.0085227 70.5,74.4176136 L70.5,34.53125 C70.5,33.6448864 69.88125,33.4232955 69.28125,33.4232955 L62.4375,33.4232955 Z M62.4375,86.6051136 C61.5375,86.6051136 61.21875,87.1221591 61.21875,87.7130682 L61.21875,95.46875 C61.21875,96.3551136 61.8375,96.5767045 62.4375,96.5767045 L69.5625,96.5767045 C70.4625,96.5767045 70.78125,96.0596591 70.78125,95.46875 L70.78125,87.7130682 C70.78125,86.8267045 70.1625,86.6051136 69.5625,86.6051136 L62.4375,86.6051136 Z"></path>
					        </g>
								</svg>`
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
				<div class="blockquote blockquote-${setConfig.cssClass()}" role="blockquote">
					<div class="blockquote-addon"></div>
					<div class="blockquote-content">
						<h5 class="blockquote-content-header">${setConfig.header()}</h5>
						<div class="blockquote-content-body">
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
					<div class="well">
						<h5 class="well-heading">Click here to edit heading</h5>
						<div class="well-body"><p>Click here to edit/paste content.</p></div>
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
						<li class="tab-item${ i == 0 ? ' active' : ''}">
							<a href="#" class="tab-item-link" data-target="tab-${id}">${label}</a>
						</li>
					`;

					navTabSections += `<section class="tab-content${ i == 0 ? ' in' : ''}" id="tab-${id}">${ hasConfig ? '{{ tab-'+ id +' }}' : '' }</section>`;
				}

				const tmpl = `
					<div class="tabs">
						<div class="tabs-bar"><ul class="tab-nav">${navTabItems}</ul></div>${navTabSections}
					</div>
				`;

				return tmpl;
			},
			contentEditorBindToElem: 'none',
			hasChildContent: true
		}
	},
  getTemplate: function(elemType,config) {
  	const template = this.elems[elemType].template(config);
    return template;
  }
};