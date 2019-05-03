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

export function NewBtnTemplateCKEDITOR(id) {
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
}

export function GetClosestParent(elem, selector) {
	if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
          var matches = (this.document || this.ownerDocument).querySelectorAll(s),
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
	return str
					.replace(/&lt;/g,'<')
					.replace(/&gt;/g,'>');
}

export function EncodeHTMLString(str) {
	return str
					.replace(/</g,'&lt;')
					.replace(/>/g,'&gt;');
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