import { TextContentParser, ComponentParser } from '../components/components';

export function dataParser(childNodes) {
  const nodesData = [];  
  
  // Iterate each child element
  [...childNodes].forEach(currentNode => {
    let data = {};
    if (currentNode.nodeType === 1) {      
      // if (AccordionParser.isTrue(currentNode)) {
      //   data = AccordionParser.parse(currentNode);
      // } else if (TabsParser.isTrue(currentNode)) {
      //   data = TabsParser.parse(currentNode);
      // } else if (StyledListsParser.isTrue(currentNode)) {
      //   data = StyledListsParser.parse(currentNode);
      // } else if (TipsParser.isTrue(currentNode)) {
      //   data = TipsParser.parse(currentNode);
      // } else if (InfoParser.isTrue(currentNode)) {
      //   data = InfoParser.parse(currentNode);
      // } else {
      //   data = TextContentParser.parse(currentNode);
      // }
      data = ComponentParser(currentNode);
      nodesData.push(data);

      // let hasChildNodesData = new data('', 1);
      // hasChildNodesData['subnodes'] = [];

      // function updateHasChildNodesData(componentCurrentNode) {
      //   hasChildNodesData.html = componentCurrentNode.html;
      //   hasChildNodesData.subnodes = componentCurrentNode.subnodes;
      //   hasChildNodesData['subData'] = componentCurrentNode.subData;
      //   temp.push(hasChildNodesData);   
      // }

      // if (TabsChildParser.isTrue(currentNode)) {
      //   const Tabs = TabsChildParser.parse(currentNode);
      //   updateHasChildNodesData(Tabs);
      // }
      // if (AccordionChildParser.isTrue(currentNode)) {
      //   const Accordion = AccordionChildParser.parse(currentNode);
      // }
    }
    else {
      if (isNaN(currentNode.length)) {
        data = TextContentParser.parse(currentNode);
        nodesData.push(data);
      }
      else {
        if (!/^\s*$/.test(currentNode.textContent)) {
          data = TextContentParser.parse(currentNode);
          nodesData.push(data);
        }
      }
    }    
  });
  
  let obj = null;
  // temp.forEach((item, index) => {
  //   // If editor comp
  //   if (item.html.includes('<div class="sf-', 0)) {
  //     // TODO: 
  //     // if (index > 1 && temp[index].html.includes('<div class="sf-editor', 0)) {
  //     //   console.log(item.html);
  //     // }
  //     if (obj !== null) {
  //       obj.html = `<div class="sf-editor-content">${obj.html}</div>`;
  //       obj = null;
  //     }
  //   }
  //   else {
  //     if (obj === null) {
  //       obj = item;
  //     }
  //     else {
  //       obj.html = obj.html + item.html;
  //       item.html = '';
  //     }
  //   }
  // });
  return nodesData;
}