// =================================================================================
// This script is created programatically in index.js. This handles the sending of
// messages coming from our DOM to our content.js via postMessage then from content
// we send messages via chrome.runtime API. Salesforce has its own configuration of 
// CKEDITOR so we need to capture the final mutation of the editor and get the 
// CKEDITOR object from Window
// =================================================================================

import { NewBtnTemplateCKEDITOR, UrlContainsArticleEdit } from '/modules/utils/chromeExtensionUtils.js';

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
		document.querySelectorAll('.cke_button__advancededitor').forEach(function(elem) {
			elem.addEventListener('click', function(event) {
				webpage.methods.popup();
			});
		});
	},
	methods: {
		popup: () => {
			const dimensions = {
        win_top: window.screenTop, 
        win_left: window.screenLeft,
        win_width: window.outerWidth, 
        win_height: window.outerHeight
			}

			const config = {
				method: 'popup',
				origin: window.location.origin,
				data: { display: true, dimensions: dimensions }
			};

			if (UrlContainsArticleEdit(window.location.href)) {
				window.postMessage(config, window.location.origin);
			}
		}
	},
	run: function() {
		this.init();
		
	}
}

webpage.run();