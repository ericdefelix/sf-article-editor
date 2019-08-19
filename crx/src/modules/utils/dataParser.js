import { TextContentParser, ComponentParser } from '../components/componentHelpers';
import { IsNullOrWhiteSpace } from './chromeExtensionUtils';

export function dataParser(childNodes) {
  const nodesData = [];

  let textContentConcatenate = '';
  
  // Iterate each child element  
  [...childNodes].forEach(currentNode => {
    let data = {};    
    if (currentNode.nodeName === '#text' || typeof currentNode.classList === 'undefined' || currentNode.classList.value === '') {
      if (!IsNullOrWhiteSpace(currentNode.textContent)) {
        textContentConcatenate += currentNode.textContent;
      }
    }

    if (currentNode.nodeName !== '#text' && typeof currentNode.classList !== 'undefined' && currentNode.classList.value !== '') {
      let combinedTextContentData = {};
      data = ComponentParser(currentNode);

      if (data.type !== 'TextContent' && textContentConcatenate !== '') {
        const p = document.createElement('p');
        p.textContent = textContentConcatenate;
        combinedTextContentData = TextContentParser.parse(p);
        nodesData.push(combinedTextContentData);
        textContentConcatenate = '';
      }
      if (nodesData.length >= 2 && textContentConcatenate !== '' && nodesData[nodesData.length-1].type === 'TextContent') {
        currentNode.insertAdjacentHTML('beforeend', textContentConcatenate);
        combinedTextContentData = TextContentParser.parse(currentNode);
        textContentConcatenate = '';
      }
      if (data.type === 'TextContent' && textContentConcatenate !== '') {
        currentNode.insertAdjacentHTML('afterbegin', textContentConcatenate);
        combinedTextContentData = TextContentParser.parse(currentNode);
        nodesData.push(combinedTextContentData);
        textContentConcatenate = '';
      }

      if (textContentConcatenate === '') nodesData.push(data);
    }
  });

  return nodesData;
}