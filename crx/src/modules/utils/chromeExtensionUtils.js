export function RequestIsValid(request) {
  let flag = false;

	const
		hasMethod = Object.prototype.hasOwnProperty.call(request, 'method'),
		hasData = Object.prototype.hasOwnProperty.call(request, 'data'),
		setFlag = (_flag) => { flag = _flag; };

  (hasMethod && hasData) ? setFlag(true) : setFlag(false);
  return flag;
}

export function UrlContainsArticleEdit(url) {
  let flag = false;
  if (url.indexOf('/knowledge/publishing/articleEdit') !== -1) flag = true;
  return flag;
}

export function SetPosition(a,b,c) { 
	return a + (b / 2) - (c / 2);
};

export function GetClosestParent(elem, selector) {
	if (!Element.prototype.matches) {
		Element.prototype.matches =
		Element.prototype.matchesSelector ||
		Element.prototype.mozMatchesSelector ||
		Element.prototype.msMatchesSelector ||
		Element.prototype.oMatchesSelector ||
		Element.prototype.webkitMatchesSelector ||
		function(s) {
				const matches = (this.document || this.ownerDocument).querySelectorAll(s),
						i = matches.length;
				while (--i >= 0 && matches.item(i) !== this) {}
				return i > -1;
		};
	}

	// Get the closest matching element
	for ( ; elem && elem !== document; elem = elem.parentNode ) {
		if ( elem.matches( selector ) ) return elem;
	}
	return null;
};

export function NormaliseHTMLString(str) {
	return str.replace(/\s{2,10}/g, ' ');
}

export function DecodeHTMLString(str) {
	return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
}

export function EncodeHTMLString(str) {
	return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

export function replaceString(baseStr, strLookup, strReplacement) {
	return baseStr.replace(strLookup, strReplacement);
}

export function GenerateID ()  {
	return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

export function GenerateTabID() {
	return Math.floor(Math.random() * 90000) + 10000;
}

export function GetComponentType(HTMLNode) {
	return HTMLNode.getAttribute('data-component-type');
}

export function SanitiseSubContentBlock(content) {	
	const
		children = content.children,
		attrsToRemove = ['id', 'spellcheck', 'style', 'contentEditable'],
		classesToRemove = ['mce-content-body'];
	
	[...children].forEach(child => {	
		child.querySelectorAll('[contenteditable="true"]').forEach(el => {
			attrsToRemove.forEach(attr => {
				if (el.hasAttribute(attr)) el.removeAttribute(attr);
			});
			classesToRemove.forEach(cssClass => {
				if (el.classList.contains(cssClass)) el.classList.remove(cssClass);
			});
		});	
	});

	return NormaliseHTMLString(content.innerHTML);
}

export function UnwrapElement(wrapper) {
	// place childNodes in document fragment
	const docFrag = document.createDocumentFragment();
	while (wrapper.firstChild) {
		const child = wrapper.removeChild(wrapper.firstChild);
		docFrag.appendChild(child);
	}

	// replace wrapper with document fragment
	wrapper.parentNode.replaceChild(docFrag, wrapper);
}

export function TinyMCEHelper(contentEditorAppConfig) {
	let tinymceConfig = {
		selector: contentEditorAppConfig.container,  // change this value according to your HTML
		inline: true,
		menubar: false,
		default_link_target: "_blank"
	};

	tinymceConfig['toolbar'] = contentEditorAppConfig.config.toolbar;
	tinymceConfig['plugins'] = contentEditorAppConfig.config.plugins;
	
	if (contentEditorAppConfig.config.toolbar.indexOf('image') !== -1) {
		tinymceConfig['image_title'] = true;
		tinymceConfig['automatic_uploads'] = true;
		tinymceConfig['paste_data_images '] = true;
		tinymceConfig['file_picker_types'] = 'image';
		tinymceConfig['file_picker_callback'] = function (cb, value, meta) {
			ImageGallery.run(editor.image_gallery);
		};
	}

	return tinymceConfig;
}