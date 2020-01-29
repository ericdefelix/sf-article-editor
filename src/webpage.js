// =================================================================================
// This script is created programatically in index.js. This handles the sending of
// messages coming from our DOM to our content.js via postMessage then from content
// we send messages via chrome.runtime API. Salesforce has its own configuration of 
// CKEDITOR so we need to capture the final mutation of the editor and get the 
// CKEDITOR object from Window
// =================================================================================

import {
	GetClosestParent,
	UrlContainsArticleEdit
} from '/modules/utils/chromeExtensionUtils.js';

const NewBtnTemplateCKEDITOR = (id) => {
	const iconBase64 = 'data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iMTZweCI+PHBhdGggZD0ibTQzMi43MzQzNzUgMGgtMzUzLjQ2ODc1Yy00My43MDcwMzEgMC03OS4yNjU2MjUgMzUuNTU4NTk0LTc5LjI2NTYyNSA3OS4yNjU2MjV2MzQuMjY5NTMxaDUxMnYtMzQuMjY5NTMxYzAtNDMuNzA3MDMxLTM1LjU1ODU5NC03OS4yNjU2MjUtNzkuMjY1NjI1LTc5LjI2NTYyNXptLTM1My40Njg3NSA3MS43NjU2MjVjLTguMjUgMC0xNS02LjcxODc1LTE1LTE1IDAtOC4yNzczNDQgNi43NS0xNSAxNS0xNXMxNSA2LjcyMjY1NiAxNSAxNWMwIDguMjgxMjUtNi43NSAxNS0xNSAxNXptNjQuMjY1NjI1IDBjLTguMjUgMC0xNS02LjcxODc1LTE1LTE1IDAtOC4yNzczNDQgNi43NS0xNSAxNS0xNXMxNSA2LjcyMjY1NiAxNSAxNWMwIDguMjgxMjUtNi43NSAxNS0xNSAxNXptNjQuMjY5NTMxIDBjLTguMjUgMC0xNS02LjcxODc1LTE1LTE1IDAtOC4yNzczNDQgNi43NS0xNSAxNS0xNXMxNSA2LjcyMjY1NiAxNSAxNWMwIDguMjgxMjUtNi43NSAxNS0xNSAxNXptMCAwIiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0ibTAgNDMyLjczNDM3NWMwIDQzLjcwNzAzMSAzNS41NTg1OTQgNzkuMjY1NjI1IDc5LjI2NTYyNSA3OS4yNjU2MjVoMzUzLjQ2ODc1YzQzLjcwNzAzMSAwIDc5LjI2NTYyNS0zNS41NTg1OTQgNzkuMjY1NjI1LTc5LjI2NTYyNXYtMjg5LjIwMzEyNWgtNTEyem0zNDEuNzkyOTY5LTE5OC4yNjE3MTljLTUuODU5Mzc1LTUuODU1NDY4LTUuODU5Mzc1LTE1LjM1NTQ2OCAwLTIxLjIxMDkzNyA1Ljg1OTM3NS01Ljg1OTM3NSAxNS4zNTU0NjktNS44NTkzNzUgMjEuMjE0ODQzIDBsNjQuMjY1NjI2IDY0LjI2NTYyNWM1Ljg1OTM3NCA1Ljg1OTM3NSA1Ljg1OTM3NCAxNS4zNTU0NjggMCAyMS4yMTQ4NDRsLTY0LjI2NTYyNiA2NC4yNjU2MjRjLTIuOTI5Njg3IDIuOTI5Njg4LTYuNzY5NTMxIDQuMzk0NTMyLTEwLjYwOTM3NCA0LjM5NDUzMi0zLjgzNTkzOCAwLTcuNjc1NzgyLTEuNDY0ODQ0LTEwLjYwNTQ2OS00LjM5NDUzMi01Ljg1NTQ2OS01Ljg1NTQ2OC01Ljg1NTQ2OS0xNS4zNTU0NjggMC0yMS4yMTA5MzdsNTMuNjYwMTU2LTUzLjY2MDE1NnptLTEzMS4zNDM3NSAxMTEuMjE4NzUgNjQuMjY5NTMxLTEyOC41MzUxNTZjMy43MDMxMjUtNy40MDYyNSAxMi43MTQ4NDQtMTAuNDEwMTU2IDIwLjEyMTA5NC02LjcwNzAzMSA3LjQxMDE1NiAzLjcwMzEyNSAxMC40MTQwNjIgMTIuNzE0ODQzIDYuNzEwOTM3IDIwLjEyNWwtNjQuMjY5NTMxIDEyOC41MzUxNTZjLTIuNjI1IDUuMjUzOTA2LTcuOTI1NzgxIDguMjkyOTY5LTEzLjQyNTc4MSA4LjI5Mjk2OS0yLjI1MzkwNyAwLTQuNTQyOTY5LS41MDc4MTMtNi42OTUzMTMtMS41ODU5MzgtNy40MTAxNTYtMy43MDMxMjUtMTAuNDE0MDYyLTEyLjcxNDg0NC02LjcxMDkzNy0yMC4xMjV6bS0xMjUuNzIyNjU3LTY4LjE2NDA2MiA2NC4yNjU2MjYtNjQuMjY5NTMyYzUuODU5Mzc0LTUuODU1NDY4IDE1LjM1NTQ2OC01Ljg1NTQ2OCAyMS4yMTQ4NDMgMCA1Ljg1NTQ2OSA1Ljg1OTM3NiA1Ljg1NTQ2OSAxNS4zNTU0NjkgMCAyMS4yMTQ4NDRsLTUzLjY2MDE1NiA1My42NjAxNTYgNTMuNjU2MjUgNTMuNjYwMTU3YzUuODU5Mzc1IDUuODU1NDY5IDUuODU5Mzc1IDE1LjM1NTQ2OSAwIDIxLjIxNDg0My0yLjkyNTc4MSAyLjkyNTc4Mi02Ljc2NTYyNSA0LjM5MDYyNi0xMC42MDU0NjkgNC4zOTA2MjYtMy44MzU5MzcgMC03LjY3NTc4MS0xLjQ2NDg0NC0xMC42MDU0NjgtNC4zOTA2MjZsLTY0LjI2NTYyNi02NC4yNjk1MzFjLTUuODU5Mzc0LTUuODU1NDY5LTUuODU5Mzc0LTE1LjM1MTU2MiAwLTIxLjIxMDkzN3ptMCAwIiBmaWxsPSIjMDAwMDAwIi8+PC9zdmc+Cg==';
	const inlineCSS = `background-image:url('${iconBase64}');background-position:0 0; background-size:auto;`;

	return `<span id="custom_cke_${id}" class="cke_toolbar" role="toolbar">
						<span class="cke_toolbar_start"></span>
						<span class="cke_toolgroup" role="presentation">
							<a id="custom_btn_cke_${id}" class="cke_button cke_button__advancededitor cke_button_off" 
								href="javascript:void(0)" title="Advanced Editor" 
								tabindex="-1" hidefocus="true" role="button" aria-labelledby="custom_btn_cke_${id}" aria-haspopup="false" onkeydown="" onfocus="">
								<span class="cke_button_icon cke_button__advancededitor_icon" style="${inlineCSS}">&nbsp;</span>
								<span id="custom_label_cke_${id}" style="display: inline;" class="cke_button_label cke_button__advancededitor_label" aria-hidden="false">Advanced Editor</span>
							</a>
						</span>
						<span class="cke_toolbar_end"></span>
					</span>`;
};


const webpage = {
	image_gallery: '',
	tempArrayImg: [],
	init: () => {
		const ckToolbox = document.getElementsByClassName('cke_toolbox');

		for (let i = 0; i <= ckToolbox.length - 1; i++) {
			const btnTmpl = NewBtnTemplateCKEDITOR(i);
			ckToolbox[i].insertAdjacentHTML('afterbegin', btnTmpl);
		}

		webpage.listeners();

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
	listeners: () => {
		const
			btnAdvancedEditor = document.querySelectorAll('.cke_button__advancededitor'),
			btnSource = document.querySelectorAll('.cke_button__source');

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

		btnSource.forEach((elem, index) => {
			const
				ckeditorProxyInstanceId = GetClosestParent(elem, '.cke').getAttribute('id'),
				contentEditorInstanceId = ckeditorProxyInstanceId.substring(4);

			elem.addEventListener('click', function (event) {
				if (CKEDITOR.instances[contentEditorInstanceId].mode !== 'source') {
					let t;

					t = setTimeout(() => {
						const
							iframe = document.getElementById(ckeditorProxyInstanceId).querySelector('iframe'),
							head = iframe.contentWindow.document.querySelector('head'),
							body = iframe.contentWindow.document.querySelector('body');

						webpage.methods.initIframeCSS(head, body, 'sf-leap');
						clearTimeout(t);
					}, 100);
				}
			});
		});

		window.addEventListener('message', function (event) {
			const method = event.data.method;

			if (event.type == 'message' && method == 'insertToContentEditor') {
				webpage.methods.insertToContentEditor(event.data);
			}
		}, false);

		for (const contentEditorInstanceId in CKEDITOR.instances) {
			CKEDITOR.instances[contentEditorInstanceId].on('change', (event) => {
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
		initIframeCSS: (head, body, theme) => {
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
					webpage.tempArrayImg.push({
						alt: alt,
						src: src
					});
				}
			}

			webpage.image_gallery = JSON.stringify(webpage.tempArrayImg);
		},
		sendImageURL: (request) => {
			window.postMessage(config, window.location.origin);
		}
	},
	run: () => {
		const testElement = document.getElementsByClassName('TypeRICH_TEXT_AREA_editable');
		if (testElement.length > 0) {
			webpage.init();
		}
	}
};

webpage.run();