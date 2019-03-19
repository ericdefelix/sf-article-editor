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
	init: function () {
		const ckToolbox = document.getElementsByClassName('cke_toolbox');

		for (let i = 0; i <= ckToolbox.length - 1; i++) {
			const btnTmpl = NewBtnTemplateCKEDITOR(i);
			ckToolbox[i].insertAdjacentHTML('afterbegin', btnTmpl);
		}
		this.listeners();

		const iframes = document.querySelectorAll('.cke_wysiwyg_frame');
		iframes.forEach(element => {
			const head = element.contentWindow.document.querySelector('head');
			const body = element.contentDocument.querySelector('body');

			webpage.methods.initIframeCSS(head, body, 'sf-leap');

			if (GetClosestParent(element, '#lineArticle_Image_Gallery') !== null) {
				webpage.methods.collectImgGallery(body);
			}
		});

		webpage.methods.initImageGallery();
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
			if (event.type == 'message' && method == 'openImageUpload') {
				webpage.methods.openImageUpload(event.data);
			}
		}, false);

		for (const contentEditorInstanceId in CKEDITOR.instances) {
			const contentEditorDOM = document.getElementById(contentEditorInstanceId);
			CKEDITOR.instances[contentEditorInstanceId].on('change', function () {
				const iframe = document.getElementById('cke_' + contentEditorInstanceId).querySelector('iframe');
				const head = iframe.contentDocument.querySelector('head');
				const body = iframe.contentDocument.querySelector('body');
				webpage.methods.initIframeCSS(head, body, 'sf-leap');

				if (GetClosestParent(contentEditorDOM, '#lineArticle_Image_Gallery') !== null) {
					webpage.methods.collectImgGallery(body);
				}
				console.log('change');
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
			const contentEditorInstanceId = request.data.ckeditorIntanceId;
			const dataHTMLString = request.data.html;
			CKEDITOR.instances[contentEditorInstanceId].setData(dataHTMLString);
		},
		openImageUpload: (request) => {
			const contentEditorInstanceId = request.data.ckeditorIntanceId;
			const imgBtn = document.getElementById('cke_' + contentEditorInstanceId).querySelector('.cke_button__sfdcimage');
			imgBtn.click();

			let t;
			t = setTimeout(() => {
				const fileUploadBtn = document.querySelector('input[type="file"]');
				const okBtn = document.querySelector('.cke_dialog_ui_button_ok');

				fileUploadBtn.onchange = function () {
					okBtn.click();
				};
				fileUploadBtn.click();
				clearTimeout(t);
			}, 50);
		},
		initImageGallery: () => {
			const imgGallery = document.getElementById('lineArticle_Image_Gallery');
			const uploadToolbox = imgGallery.querySelector('.cke_toolbox');
			const toolboxItems = [...uploadToolbox.children];

			// Hide controls for Article Image Gallery and extract URLs
			for (let i = 0; i < toolboxItems.length; i++) {
				const btn = toolboxItems[i].querySelector('.cke_toolgroup .cke_button');
				if (btn.classList.contains('cke_button__sfdcimage') ||
					btn.classList.contains('cke_button__source')) continue;
				toolboxItems[i].style.display = 'none';
			}
		},
		collectImgGallery: (body) => {
			const
				images = body.children,
				arr = [...images],
				tempArray = [];
			
			for (let index = 0; index < arr.length; index++) {
				const el = arr[index];
				if (el.nodeType == 1 && el.nodeName == 'IMG') {
					el.style.width = 200;
					el.style.height = 'auto';
					tempArray.push({ alt: el.getAttribute('alt'), src: el.getAttribute('src') });
				}
			}

			webpage.image_gallery = JSON.stringify(tempArray);
			console.log(webpage.image_gallery);
		},
		sendImageURL: (request) => {
			window.postMessage(config, window.location.origin);
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