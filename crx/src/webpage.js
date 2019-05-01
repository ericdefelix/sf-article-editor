// =================================================================================
// This script is created programatically in index.js. This handles the sending of
// messages coming from our DOM to our content.js via postMessage then from content
// we send messages via chrome.runtime API. Salesforce has its own configuration of 
// CKEDITOR so we need to capture the final mutation of the editor and get the 
// CKEDITOR object from Window
// =================================================================================

import { NewBtnTemplateCKEDITOR, UrlContainsArticleEdit, GetClosestParent } from '/modules/utils/chromeExtensionUtils.js';

const webpage = {
	image_gallery: '',
	tempArrayImg: [],
	init: function () {
		const ckToolbox = document.getElementsByClassName('cke_toolbox');

		for (let i = 0; i <= ckToolbox.length - 1; i++) {
			const btnTmpl = NewBtnTemplateCKEDITOR(i);
			ckToolbox[i].insertAdjacentHTML('afterbegin', btnTmpl);
		}

		this.listeners();

		const iframes = document.querySelectorAll('.cke_wysiwyg_frame');

		iframes.forEach(element => {
			const
				head = element.contentWindow.document.querySelector('head'),
				body = element.contentDocument.querySelector('body');

			webpage.methods.initIframeCSS(head, body, 'sf-leap');
			webpage.methods.collectImgGallery(body);
		});

		webpage.methods.initContentEditorState();
	},
	listeners: function () {
		const btnAdvancedEditor = document.querySelectorAll('.cke_button__advancededitor');
		
		btnAdvancedEditor.forEach((elem, index) => {
			const
				ckeditorProxyInstanceId = GetClosestParent(elem, '.cke').getAttribute('id'),
				contentEditorInstanceId = ckeditorProxyInstanceId.substring(4);

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
			CKEDITOR.instances[contentEditorInstanceId].on('change', function () {
				const
					iframe = document.getElementById('cke_' + contentEditorInstanceId).querySelector('iframe'),
					head = iframe.contentDocument.querySelector('head'),
					body = iframe.contentDocument.querySelector('body');
				
				webpage.methods.initIframeCSS(head, body, 'sf-leap');
				webpage.methods.collectImgGallery(body);
			});
		}
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
					instanceHTML: CKEDITOR.instances[contentEditorInstanceId].getData(),
					image_gallery: webpage.image_gallery
				}
			};

			if (UrlContainsArticleEdit(window.location.href)) {
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
			const
				contentEditorInstanceId = request.data.ckeditorIntanceId,
				dataHTMLString = request.data.html;
			
			CKEDITOR.instances[contentEditorInstanceId].setData(dataHTMLString);

			const contentEditorContainer = document.getElementById('cke_' + contentEditorInstanceId);
			contentEditorContainer.style.boxShadow = '0 0 1px 1px rgb(15, 156, 247)';
			contentEditorContainer.style.webkitBoxShadow = '0 0 1px 1px rgb(15, 156, 247)';

			let t;
			t = setTimeout(() => {
				contentEditorContainer.style.boxShadow = '';
				contentEditorContainer.style.webkitBoxShadow = '';
				clearTimeout(t);
			}, 3000);
		},
		initContentEditorState: () => {
			const
				imgGallery = document.getElementById('lineArticle_Image_Gallery'),
				uploadToolbox = imgGallery.querySelector('.cke_toolbox'),
				toolboxItems = [...uploadToolbox.children];

			// Hide controls for Article Image Gallery and extract URLs
			for (let i = 0; i < toolboxItems.length; i++) {
				const btn = toolboxItems[i].querySelector('.cke_toolgroup .cke_button');

				if (btn.classList.contains('cke_button__sfdcimage') ||
					btn.classList.contains('cke_button__source'))
					continue;
				
				toolboxItems[i].style.display = 'none';
			}
		},
		collectImgGallery: (body) => {
			const
				images = body.children,
				arr = [...images];
			
			for (let index = 0; index < arr.length; index++) {
				const
					el = arr[index],
					alt = el.getAttribute('alt'),
					src = el.getAttribute('src');
				
				if (el.nodeType == 1 && el.nodeName == 'IMG' && !el.classList.contains('cke_anchor')) {
					el.style.width = 200;
					el.style.height = 'auto';
					webpage.tempArrayImg.push({ alt: alt, src: src });
				}
			}

			webpage.image_gallery = JSON.stringify(webpage.tempArrayImg);
		},
		sendImageURL: (request) => {
			window.postMessage(config, window.location.origin);
		}
	},
	run: () => {
		webpage.init();
	}
};

webpage.run();