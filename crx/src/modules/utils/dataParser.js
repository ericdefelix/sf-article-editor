import { TextContentParser, ComponentParser } from '../components/componentHelpers';
import { IsNullOrWhiteSpace } from './chromeExtensionUtils';

export function dataParser(childNodes) {
  const nodesData = [];

  let textContentConcatenate = '';

  let textContentData = null;

  const appendToTextContentData = () => {

  };
  
  // Iterate each child element  
  [...childNodes].forEach(currentNode => {
    if (typeof currentNode.classList === 'undefined') {
      if (textContentData === null) {
        textContentData = document.createElement('DIV');
        textContentData.setAttribute('class', 'sf-editor-content');
        textContentData.appendChild(currentNode);
      }

      // TODO
    }
    else {
      //typeof currentNode.classList !== 'undefined' && 
      if (currentNode.classList.value.includes('sf-', 0)) {
        textContentData = null;
      }
      else {
        if (textContentData !== null) {
          textContentData.appendChild(currentNode);
        }
      }
    }
    // let data = {};
    // if (currentNode.nodeName === '#text' || typeof currentNode.classList === 'undefined' || currentNode.classList.value === '') {
    //   if (!IsNullOrWhiteSpace(currentNode.textContent)) {
    //     textContentConcatenate += currentNode.textContent;
    //   }
    // }

    // if (currentNode.nodeName !== '#text' && typeof currentNode.classList !== 'undefined' && currentNode.classList.value !== '') {
    //   let combinedTextContentData = {};
    //   data = ComponentParser(currentNode);
    //   console.log(data.type);
      

    //   if (data.type !== 'TextContent' && textContentConcatenate !== '') {
    //     const div = document.createElement('div');
    //     div.textContent = textContentConcatenate;
    //     combinedTextContentData = TextContentParser.parse(div);
    //     nodesData.push(combinedTextContentData);
    //     textContentConcatenate = '';
    //   }
    //   if (nodesData.length >= 2 && textContentConcatenate !== '' && nodesData[nodesData.length-1].type === 'TextContent') {
    //     currentNode.insertAdjacentHTML('beforeend', textContentConcatenate);
    //     combinedTextContentData = TextContentParser.parse(currentNode);
    //     textContentConcatenate = '';
    //   }
    //   if (data.type === 'TextContent' && textContentConcatenate !== '') {
    //     currentNode.insertAdjacentHTML('afterbegin', textContentConcatenate);
    //     combinedTextContentData = TextContentParser.parse(currentNode);
    //     nodesData.push(combinedTextContentData);
    //     textContentConcatenate = '';
    //   }
    // }
  });

  console.log(nodesData);
  

  return nodesData;
}