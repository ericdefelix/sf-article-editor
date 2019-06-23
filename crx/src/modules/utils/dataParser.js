import { ComponentParser } from '../components/components';

console.log(ComponentParser);

export function dataParser(childNodes) {
  const
    temp = [],

    data = (html) => {
      return { html: html, type: '' };
    };
  
  // Iterate each child element
  [...childNodes].forEach(currentNode => {
    if (isNaN(currentNode.length)) {
      temp.push(new data(currentNode.outerHTML));
    }
    else {
      if (!/^\s*$/.test(currentNode.textContent)) {
        temp.push(new data(currentNode.textContent));
      }
    }
  });
  
  let obj = null;

  temp.forEach((item, index) => {
    // If editor comp
    if (item.html.includes('<div class="sf-', 0)) {
      // if (index > 1 && temp[index].html.includes('<div class="sf-editor', 0)) {
      //   console.log(item.html);
      // }
// TODO: 
      if (obj !== null) {
        obj.html = `<div class="sf-editor-content">${obj.html}</div>`;
        obj = null;
      }
    }
    else {
      if (obj === null) {
        obj = item;
      }
      else {
        obj.html = obj.html + item.html;
        item.html = '';
      }
    }
  });

  return temp.filter((item) => {
    item.type = (() => {
      return ComponentParser['TextContentParser'].parseHTML(item.html);
    });

    return item.html !== '';
  });

  // return [];
}