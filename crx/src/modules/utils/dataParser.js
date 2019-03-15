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
    
    if (nodeType == 1 && node.hasAttribute('class') && isFromEditor(node.classList.value)) {
      _data.type = uiType(node.classList.value);
      _data.metadata.html = nodeHTML.replace(/^\s+|\s+$/g, '').trim();
      tempArray.push(_data);
      previousNodeIsFromEditor = true;
    }

    if (!previousNodeIsFromEditor) {
      _data.type = 'editorContent';

      if (nodeType == 1) {
        _data.metadata.html = nodeHTML;
        tempArray.push(_data);
      };

      if (nodeType == 3) {
        const str = nodeValue.replace(/^\s+|\s+$/g, '').trim();
        if (str !== '') {
          // WIP
          if (tempArray.length > 0 && tempArray[tempArray.length - 1].type !== 'editorContent') {
            console.log('add');
            _data.metadata.html = nodeValue;
            tempArray.push(_data);
          }
          else {
            console.log(tempArray);
            // tempArray[tempArray.length - 1].metadata.html += nodeValue;
          }
          // WIP
        }
      }
      
      previousNodeIsFromEditor = false;
    }
  }

  console.log(tempArray);
};

// !previousNodeIsFromEditor ? tempArray.push(_data) : tempArray[tempArray.length - 1].metadata.html += nodeValue;