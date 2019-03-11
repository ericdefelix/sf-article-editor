// =================================================================================
// This script is created programatically in index.js. This handles the sending of
// messages coming from our DOM to our content.js via postMessage then from content
// we send messages via chrome.runtime API. Salesforce has its own configuration of 
// CKEDITOR so we need to capture the final mutation of the editor and get the 
// CKEDITOR object from Window
// =================================================================================

import { NewBtnTemplateCKEDITOR, UrlContainsArticleEdit, GetClosestParent } from '/modules/utils/chromeExtensionUtils.js';

const webpage = {
	init: function () {
		const ckToolbox = document.getElementsByClassName('cke_toolbox');

		for (let i = 0; i <= ckToolbox.length - 1; i++) {
			const btnTmpl = NewBtnTemplateCKEDITOR(i);
			ckToolbox[i].insertAdjacentHTML('afterbegin', btnTmpl);
		}
		this.listeners();

		CKEDITOR.config.allowedContent = true;

		const iframes = document.querySelectorAll('.cke_wysiwyg_frame');
		iframes.forEach(element => {
			const head = element.contentWindow.document.querySelector('head');
			const body = element.contentDocument.querySelector('body');

			webpage.methods.initIframeCSS(head, body, 'sf-leap');
		});
	},
	listeners: function () {
		const btnAdvancedEditor = document.querySelectorAll('.cke_button__advancededitor');
		
		btnAdvancedEditor.forEach((elem, index) => {
			const ckeditorProxyInstanceId = GetClosestParent(elem, '.cke').getAttribute('id');
			const contentEditorInstanceId = ckeditorProxyInstanceId.substring(4);

			elem.setAttribute('data-instance-id', contentEditorInstanceId);
			elem.addEventListener('click', function (event) {
				const btnInstanceId = this.getAttribute('data-instance-id');
				webpage.methods.popup(btnInstanceId);
			});
		});

		window.addEventListener('message', function (event) {
			const method = event.data.method;
			if (event.type == 'message' && method == 'insertToContentEditor') {
				webpage.methods.insertToContentEditor(event.data);
			}
		}, false);


		for (const contentEditorInstanceId in CKEDITOR.instances) {
			const ckeditorTxtAreaValue = document.getElementById(contentEditorInstanceId).textContent;
			if (ckeditorTxtAreaValue !== '' && ckeditorTxtAreaValue.indexOf('blockquote-addon') !== -1) {
				webpage.methods.insertToContentEditor({
					data: {
						ckeditorIntanceId: contentEditorInstanceId,
						html: ckeditorTxtAreaValue
					}
				});
			}

			CKEDITOR.instances[contentEditorInstanceId].on('change', function () {
				const iframe = document.getElementById('cke_' + contentEditorInstanceId).querySelector('iframe');
				const head = iframe.contentDocument.querySelector('head');
				const body = iframe.contentDocument.querySelector('body');
				webpage.methods.initIframeCSS(head, body, 'sf-leap');
			});
		}

		// window.addEventListener('beforeunload', webpage.methods.closePopups);
	},
	methods: {
		popup: (contentEditorInstanceId) => {
			const dimensions = {
				win_top: window.screenTop,
				win_left: window.screenLeft,
				win_width: window.outerWidth,
				win_height: window.outerHeight
			};

			const config = {
				method: 'popup',
				origin: window.location.origin,
				data: {
					display: true,
					dimensions: dimensions,
					contentEditorInstanceId: contentEditorInstanceId,
					instanceHTML: CKEDITOR.instances[contentEditorInstanceId].getData()
				}
			};

			if (UrlContainsArticleEdit(window.location.href)) {
				console.log(config);
				window.postMessage(config, window.location.origin);
			}
		},
		initIframeCSS: (head,body,theme) => {
			let linkElement = document.createElement('link');
			linkElement.setAttribute('rel', 'stylesheet');
			linkElement.setAttribute('type', 'text/css');
			linkElement.setAttribute('href', document.getElementById('injectedCSSURL').value);

			head.appendChild(linkElement);
			body.classList.add(theme);
		},
		insertToContentEditor: (request) => {
			let t;
			const contentEditorInstanceId = request.data.ckeditorIntanceId;
			const dataHTMLString = request.data.html;
			CKEDITOR.instances[contentEditorInstanceId].setData(dataHTMLString);
		},
		closePopups: (e) => {
			console.log('close popups');
			const config = {
				method: 'closePopups',
				origin: window.location.origin,
				data: {}
			};

			window.postMessage(config, window.location.origin);
		}
	},
	run: function () {
		this.init();
		
	}
};

webpage.run();