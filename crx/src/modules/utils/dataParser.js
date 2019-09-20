import { ComponentParser } from '../components/componentHelpers';
import { IsNullOrWhiteSpace } from './chromeExtensionUtils';


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

  // Iterate each child element 
  [...htmlSection.childNodes].forEach(currentNode => {
    let data = {};
    data = ComponentParser(currentNode);
    nodesData.push(data);
  });

  console.log(nodesData);
  

  return nodesData;
}