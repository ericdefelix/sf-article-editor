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

  const htmlNodes = [...childNodes];
  const tempArray = [];
  let previousNodeIsFromEditor = false;
  
  for (let i = 0; i < htmlNodes.length; i++) {
    const
      node = htmlNodes[i],
      nodeType = node.nodeType,
      nodeHTML = node.outerHTML,
      nodeValue = node.nodeValue;

    let _data = data();
    if (nodeType == 1 && node.hasAttribute('class') && dependencies.ContentBlocks.elems[uiType(node.classList.value)].hasChildContent) {
      _data['subnodes'] = [];

      const tabLinks = node.querySelectorAll('.tab-item-link');

      tabLinks.forEach(function(el, index) {
        const 
          label = el.textContent, id = el.getAttribute('id').split('target_')[1],
          tabSection = node.querySelector('#' + id);

        _data.subnodes.push({ label: label, id: id, content: [] });

        if (tabSection.firstChild != null) {
          const subHtmlNodes = tabSection.children;

          for (let subnode of subHtmlNodes) {
            let _subData = data();

            _subData.type = uiType(subnode.classList.value);
            _subData.metadata.html = subnode.outerHTML;
            _data.subnodes[index].content.push(_subData);
          }
        }

      });

      previousNodeIsFromEditor = true;
    }


    if (nodeType == 1 && node.hasAttribute('class') && isFromEditor(node.classList.value)) {
      _data.type = uiType(node.classList.value);
      _data.metadata.html = nodeHTML.replace(/^\s+|\s+$/g, '').trim();
      tempArray.push(_data);
      previousNodeIsFromEditor = true;
    }

    if (nodeType == 1 && !node.hasAttribute('class') && !isFromEditor('')) {
      _data.type = 'textEditor';
      _data.metadata.html = nodeHTML.replace(/^\s+|\s+$/g, '').trim();
      tempArray.push(_data);
      // previousNodeIsFromEditor = false;
    }

    if (!previousNodeIsFromEditor) {
      if (nodeType == 3) {
        const str = nodeValue.replace(/^\s+|\s+$/g, '').trim();
      }

      _data.type = 'textEditor';

      if ((nodeType == 1 || (nodeType == 3 && typeof str !== 'undefined' && str !== '')) && tempArray.length == 0 || 
          (nodeType == 1 || (nodeType == 3 && typeof str !== 'undefined' && str !== '')) && tempArray.length > 0 && 
      tempArray[tempArray.length - 1].type !== 'textEditor') {
        _data.metadata.html = nodeType == 3 ? nodeValue : nodeHTML;
        tempArray.push(_data);
      }

      if ((nodeType == 1 || (nodeType == 3 && typeof str !== 'undefined' && str !== '')) && tempArray.length > 0 && 
        tempArray[tempArray.length - 1].type === 'textEditor') {
        tempArray[tempArray.length - 1].metadata.html += nodeType == 3 ? nodeValue : nodeHTML;
      }

      previousNodeIsFromEditor = false;
    }
  }

  console.log(tempArray);
  return tempArray;
};

// !previousNodeIsFromEditor ? tempArray.push(_data) : tempArray[tempArray.length - 1].metadata.html += nodeValue;