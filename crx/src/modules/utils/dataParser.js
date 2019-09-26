import { ComponentParser } from '../components/componentHelpers';

export function dataParser(htmlSection) {
  const nodesData = [];
  const dataFormatter = (element, nodeList) => {
    let lastIgnoreIndex = -1;
    const newList = [];

    nodeList.forEach((item, index) => {
      // if ignore at index
      const ignore = item.className && item.className.match("sf-");

      if (ignore) {
        // push straight
        newList.push(item);
        lastIgnoreIndex = index;
      } else {
        const isPrevArray = Array.isArray(newList[index - 1]);
        // either 1ts item is note ignore or first of non-ignore slice
        if (
          (lastIgnoreIndex < 0 || lastIgnoreIndex === index - 1) &&
          !isPrevArray
        ) {
          lastIgnoreIndex = 0;
          const newArr = [item];
          newList.push(newArr);
          return;
        }
        newList[newList.length - 1].push(item);
      }
    });

    // transformation retuns array
    return newList.map((item, index) => {
      if (Array.isArray(item)) {
        // do transform as item is an array\
        const newDiv = document.createElement("div");
        newDiv.setAttribute("class", "sf-editor-content");
        element.insertBefore(newDiv, item[0]);
        item.map(i => newDiv.appendChild(i));
      }
    });
  };

  dataFormatter(htmlSection, htmlSection.childNodes);
  
  const testNodesData = [];
  // Iterate each child element 

  function iterateDOM(htmlBlock) {

    [...htmlBlock.children].forEach(currentNode => {
      console.log(currentNode);
      
      const data = ComponentParser(currentNode);
      
      if (typeof data.hasSubnodes !== 'undefined' || data.hasSubnodes) {

        data['subnodes'] = (() => {
          // const subnodes = [];
          data.subnodes.forEach(subnode => {
            subnode['elements'] = [];
            // if (container.children.length !== 0) {
            //   [...container.children].forEach(child => {
            //     const subData = ComponentParser(child);
            //     if (child.nodeType === 1) elements.push(subData);
            //   });
            // }
            // console.log(subnode.container.children);
            
            // iterateDOM(subnode.dom);
            // console.log(subnode.container);
            
            iterateDOM(subnode.container);
            // subnode.elements.push('test');

            // container.innerHTML = '';

            // subnodes.push(data);
            // data.containers.push({ dom: container, title: titles === null ? null : titles[index].textContent });
          });

          // return subnodes;
        })();

        testNodesData.push(data);
      }
      else {
        testNodesData.push(data);
        return;
      }
    });
  }

  iterateDOM(htmlSection);
  console.log(testNodesData);
  

  [...htmlSection.childNodes].forEach(currentNode => {
    let data = {};
    data = ComponentParser(currentNode);
    nodesData.push(data);
  });
  

  // return nodesData;
  return nodesData;
}