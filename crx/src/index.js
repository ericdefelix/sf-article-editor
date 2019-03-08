'use strict';

// =================================================================================
// This serves as the content script. This is injected via the background.js after 
// DOM Onload so that we could listen for DOM changes to all Rich Text Area fields
// Unfortunately, we can't use es6 modules for content scripts, unlike webpage.js
// and background.js. This script will attach a script to the page which will handle
// the triggers coming from Salesforce.
// =================================================================================
const index = {
	crxID: '',
	init: function () {
		// Get the first FieldCol node (pristine state) rendered by Salesforce and observe if
		// CKEDITOR starts manipulating the DOM
		// -- server rendered
		const testElement = document.getElementsByClassName('TypeRICH_TEXT_AREA_editable');

		MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
		if (testElement.length > 0) {
			const observer = new MutationObserver((mutations, observer) => {

				const webpageScript = document.createElement('script');
				webpageScript.setAttribute('type', 'module');
				webpageScript.setAttribute('src', chrome.extension.getURL('webpage.js'));

				webpageScript.onload = () => { webpageScript.remove(); };

				(document.head || document.documentElement).appendChild(webpageScript); // Attach to document

				observer.disconnect(); // Stop observing if CKEDITOR is initialised

				window.addEventListener('message', function (event) {
					const method = event.data.method;

					// We only accept messages from ourselves
					if (event.source != window) return;
					if (event.type == 'message' && method == 'popup') {
						chrome.runtime.sendMessage(event.data);
					}

					if (event.type == 'message' && method == 'closePopups') {
						chrome.runtime.sendMessage(event.data);
					}

				}, false);
			});

			observer.observe(testElement[testElement.length - 1], { subtree: true, childList: true, attributes: true });
		}

		chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
			const method = request.method;
			if (method == 'insertToContentEditor') {
				window.postMessage(request, window.location.origin);
				console.log('im from index');
			}
			if (method == 'initEditor') {
				console.log('im from index');
			}
		});
	},
	run: function () {
		index.init();
	}
};

index.run();