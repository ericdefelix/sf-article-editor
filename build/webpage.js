// =================================================================================
// This script is created programatically in index.js. This handles the sending of
// messages coming from our DOM to our content.js via postMessage then from content
// we send messages via chrome.runtime API. Salesforce has its own configuration of 
// CKEDITOR so we need to capture the final mutation of the editor and get the 
// CKEDITOR object from Window
// =================================================================================

import { NewBtnTemplateCKEDITOR, UrlContainsArticleEdit, GetClosestParent } from '/modules/utils/chromeExtensionUtils.js';

const webpage = {
	init: function() {
		const ckToolbox = document.getElementsByClassName('cke_toolbox');

    for (let i = 0; i <= ckToolbox.length - 1; i++) {
    	const btnTmpl = NewBtnTemplateCKEDITOR(i);
		  ckToolbox[i].insertAdjacentHTML('afterbegin', btnTmpl);
    }
    this.listeners();
	},
	listeners: function() {
		const btnAdvancedEditor = document.querySelectorAll('.cke_button__advancededitor');
		btnAdvancedEditor.forEach(function(elem,index) {

			const ckeditorProxyInstanceId = GetClosestParent(elem,'.cke').getAttribute('id');
			const ckeditorInstanceId = ckeditorProxyInstanceId.substring(4);

			elem.setAttribute('data-instance-id', ckeditorInstanceId);
			elem.addEventListener('click', function(event) {
				const btnInstanceId = this.getAttribute('data-instance-id');
				webpage.methods.popup(btnInstanceId);
			});
		});

		window.addEventListener('message', function(event) {
			const method = event.data.method;
			if (event.type == 'message' && method == 'insertToCKEDITOR') {
				webpage.methods.insertToCKEDITOR(event.data);
			}
		}, false);

		window.addEventListener('beforeunload', webpage.methods.closePopups);
	},
	methods: {
		popup: (ckeditorInstanceId) => {
			const dimensions = {
        win_top: window.screenTop, 
        win_left: window.screenLeft,
        win_width: window.outerWidth, 
        win_height: window.outerHeight
			}

			const config = {
				method: 'popup',
				origin: window.location.origin,
				data: { 
					display: true, 
					dimensions: dimensions, 
					ckeditorInstanceId: ckeditorInstanceId,
					instanceHTML: CKEDITOR.instances[ckeditorInstanceId].getData()
				}
			};

			if (UrlContainsArticleEdit(window.location.href)) {
				window.postMessage(config, window.location.origin);
			}
		},
		insertToCKEDITOR: (request) => {
			const ckeditorInstanceId = request.data.ckeditorIntanceId;
			const dataHTMLString = request.data.html;
			CKEDITOR.instances[ckeditorInstanceId].setData(dataHTMLString);
		},
		closePopups: (e) => {
			console.log('close popups');			
			const config = {
				method: 'closePopups',
				origin: window.location.origin,
				data: {}
			}

			window.postMessage(config, window.location.origin);
		}
	},
	run: function() {
		this.init();
		
	}
}

webpage.run();