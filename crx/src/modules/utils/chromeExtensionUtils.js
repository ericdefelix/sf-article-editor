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

export function DataTemplate () {
	return { html: '', type: '', nodeLevel: 1, hasSubnodes: false, subnodes: [] };
};

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
		default_link_target: "_blank",
		toolbar: contentEditorAppConfig.config.toolbar,
		plugins: contentEditorAppConfig.config.plugins
	};
	
	if (contentEditorAppConfig.config.toolbar.indexOf('image') !== -1) {
		// cb, value, meta
		tinymceConfig['image_title'] = true;
		tinymceConfig['automatic_uploads'] = true;
		tinymceConfig['paste_data_images'] = true;
		tinymceConfig['file_picker_types'] = 'image';
		tinymceConfig['file_picker_callback'] = function (cb, value, meta) {			
			// ImageGallery.run(contentEditorAppConfig.images);		
		};
	}

	return tinymceConfig;
}

export function IsNullOrWhiteSpace(str) {
	return (!str || str.length === 0 || /^\s*$/.test(str));
}

export function ExtractSubnodes(params, ComponentParser) {
	const data = { containers: [], elements: [] };
	const titles = [...params.htmlNode.querySelectorAll(params.titleSelector)];
	params.htmlNode.querySelectorAll(params.containerSelector).forEach((container, index) => {
		const elements = [];
		if (container.children.length !== 0) {
			[...container.children].forEach(child => {
				const subData = ComponentParser(child);
				subData.nodeLevel = 2;
				if (child.nodeType === 1) elements.push(subData);
			});
		}

		data.elements.push(elements);

		container.innerHTML = '';
		data.containers.push({ dom: container, title: titles[index].textContent });
	});

	return data;
}