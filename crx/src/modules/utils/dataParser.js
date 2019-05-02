import { GenerateID } from './chromeExtensionUtils';
import ContentBlocks from '../ContentBlocks';

export function dataParser(childNodes) {
  const
    contentBlockClassNames = Object.keys(ContentBlocks.elems).map((key) => ContentBlocks.elems[key].cssClass),
  
    data = () => {
      return { id: GenerateID(), type: '', metadata: { html: '' } };
    },

    isFromEditor = (cssClasses) => {
      return cssClasses.split(' ')
        .some(className => contentBlockClassNames
        .indexOf(className) >= 0);
    },

    uiType = (cssClasses) => {
      let uiType = '';
      cssClasses.split(' ').some(className => {
        uiType = Object.keys(ContentBlocks.elems).find(key => ContentBlocks.elems[key].cssClass === className);
        return contentBlockClassNames.includes(className);
      });
      return uiType;
    },

    isElement = (obj) => {
      try {
        return obj instanceof HTMLElement;
      }
      catch (e) {
        return (typeof obj === "object") &&
          (obj.nodeType === 1) && (typeof obj.style === "object") &&
          (typeof obj.ownerDocument === "object");
      }
    },

    checkIfNewObject = (currentPointer) => {
      let flag = true;
      if (tempArray.length == 0) return true;
      flag = tempArray[tempArray.length - 1].type == 'textEditor' && currentPointer == 'textEditor' ? false : true;
      return flag;
    };
  
  let
    tempArray = [],
    pushAsNewObject = true;

  [...childNodes].forEach(node => {
    // ================
    const nodeType = node.nodeType;
    let nodeValue, _data = data();

    if (!isElement(node) && !node.nodeValue || /^\s*$/.test(node.nodeValue)) return;
    if (isElement(node)) {
      if (node.hasAttribute('class') && isFromEditor(node.classList.value)) {
        _data.type = uiType(node.classList.value);
        pushAsNewObject = checkIfNewObject(_data.type);

        if (ContentBlocks.elems[uiType(node.classList.value)].hasChildContent) {
          _data.metadata['subnodes'] = [];
          nodeValue = node.outerHTML;

          node.querySelectorAll('.sf-tab-item-link').forEach(function (el, index) {
            const
              label = el.textContent, id = el.getAttribute('id').split('target_')[1],
              tabSection = node.querySelector('#' + id);

            _data.metadata.subnodes.push({ label: label, id: id.split('tab-')[1], content: [] });

            // ==== If tabsection's firstChild is not null ===  //
            if (tabSection.firstChild != null) {
              const subHtmlNodes = tabSection.children;

              [...subHtmlNodes].forEach(subnode => {
                let _subData = data();
                pushAsNewObject = true;
                _subData.type = uiType(subnode.classList.value);
                _subData.metadata.html = subnode.outerHTML;
                _data.metadata.subnodes[index].content.push(_subData);                
              });
            }
            // ==== ================================= =====  //
          });

        }
      }
      else {
        _data.type = 'textEditor';
        pushAsNewObject = checkIfNewObject('textEditor');
      }

      nodeValue = node.outerHTML;
    }
    else {
      _data.type = 'textEditor';
      pushAsNewObject = checkIfNewObject('textEditor');
      nodeValue = node.nodeValue;
    }

    // Determine whether we push new data or just append it from the previous data
    // if HTML elements can be grouped in one Content Editor
    _data.metadata.html = nodeValue;
    pushAsNewObject ? tempArray.push(_data) : tempArray[tempArray.length - 1].metadata.html += _data.metadata.html;
    // ================
  });

  return tempArray;
};