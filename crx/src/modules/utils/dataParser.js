export function dataParser(childNodes, dependencies) {
  const data = () => {
    return {
      id: dependencies.GenerateID(),
      type: '',
      metadata: { html: '' }
    };
  };

  const isFromEditor = (cssClasses) => {
    const css = cssClasses.split(' ');
    let flag = false;
    for (let index = 0; index < css.length; index++) {
      if (dependencies.ContentBlocks.keywords.indexOf(css[index]) !== -1) {
        flag = true;
        break;
      }
    }
    return flag;
  };

  const uiType = (cssClasses) => {
    const css = cssClasses.split(' ');
    let type = '';
    for (let index = 0; index < css.length; index++) {
      if (dependencies.ContentBlocks.keywords.indexOf(css[index]) !== -1) {
        type = dependencies.ContentBlocks.keyword_map[css[index]];
        break;
      }
    }
    return type;
  };

  const isElement = (obj) => {
    try {
      return obj instanceof HTMLElement;
    }
    catch (e) {
      return (typeof obj === "object") &&
        (obj.nodeType === 1) && (typeof obj.style === "object") &&
        (typeof obj.ownerDocument === "object");
    }
  };

  const pushTo = (arrayLocation) => {

  };

  const htmlNodes = [...childNodes];
  
  let tempArray = [];
  let pushAsNewObject = true;

  const checkIfNewObject = (currentPointer) => {
    let flag = true;
    if (tempArray.length > 0) {
      if (tempArray[tempArray.length - 1].type !== 'textEditor' && currentPointer !== 'textEditor') {
        flag = false;
      }
    }
    return flag;
  };

  for (let i = 0; i < htmlNodes.length; i++) {
    // ================
    const node = htmlNodes[i], nodeType = node.nodeType;
    let nodeValue, _data = data();
    
    if (!isElement(node) && !node.nodeValue || /^\s*$/.test(node.nodeValue)) continue;
    if (isElement(node)) {
      if (node.hasAttribute('class') && isFromEditor(node.classList.value)) {
        _data.type = uiType(node.classList.value);
        pushAsNewObject = checkIfNewObject(_data.type);
        
        if (dependencies.ContentBlocks.elems[uiType(node.classList.value)].hasChildContent) {
          _data['subnodes'] = [];
          nodeValue = node.outerHTML;
          node.querySelectorAll('.tab-item-link').forEach(function (el, index) {
            const
              label = el.textContent, id = el.getAttribute('id').split('target_')[1],
              tabSection = node.querySelector('#' + id);
            _data.subnodes.push({ label: label, id: id, content: [] });
            if (tabSection.firstChild != null) {
              const subHtmlNodes = tabSection.children;

              for (let subnode of subHtmlNodes) {
                let _subData = data();
                pushAsNewObject = true;
                _subData.type = uiType(subnode.classList.value);
                _subData.metadata.html = subnode.outerHTML;
                _data.subnodes[index].content.push(_subData);
              }
            }
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
    console.log(pushAsNewObject);
    if (pushAsNewObject) {
      tempArray.push(_data);
    }
    else {
      tempArray[tempArray.length - 1].metadata.html += nodeValue;
    }
    // ================
  }

  console.log(tempArray);
  return [];
};

// !previousNodeIsFromEditor ? tempArray.push(_data) : tempArray[tempArray.length - 1].metadata.html += nodeValue;