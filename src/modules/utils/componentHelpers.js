import {
  AccordionLabel,
  ParseHTML as AccordionParser
} from '../components/accordion';
import { InfoLabel, ParseHTML as InfoParser } from '../components/info';
import {
  StyledListsLabel,
  ParseHTML as StyledListsParser
} from '../components/styled-lists';
import { TabsLabel, ParseHTML as TabsParser } from '../components/tabs';
import {
  TextContentLabel,
  ParseHTML as TextContentParser
} from '../components/text-content';
import { TipsLabel, ParseHTML as TipsParser } from '../components/tips';

const ComponentTypes = {
  TextContent: TextContentLabel,
  Info: InfoLabel,
  Tips: TipsLabel,
  StyledLists: StyledListsLabel,
  Tabs: TabsLabel,
  Accordion: AccordionLabel
};

const ComponentParser = function (currentNode) {
  let data = {};
  if (AccordionParser.isTrue(currentNode)) {
    // storeMarkupErrors(`${currentNode}`, 'AccordionParser');
    data = AccordionParser.parse(currentNode);
  } else if (TabsParser.isTrue(currentNode)) {
    // storeMarkupErrors(`${currentNode}`, 'TabsParser');
    data = TabsParser.parse(currentNode);
  } else if (StyledListsParser.isTrue(currentNode)) {
    // storeMarkupErrors(`${currentNode}`, 'StyledListsParser');
    data = StyledListsParser.parse(currentNode);
  } else if (TipsParser.isTrue(currentNode)) {
    // storeMarkupErrors(`${currentNode}`, 'TipsParser');
    data = TipsParser.parse(currentNode);
  } else if (InfoParser.isTrue(currentNode)) {
    // storeMarkupErrors(`${currentNode}`, 'InfoParser');
    data = InfoParser.parse(currentNode);
  } else {
    // storeMarkupErrors(`${currentNode}`, 'TextContentParser');
    data = TextContentParser.parse(currentNode);
  }
  return data;
};

export { ComponentTypes, ComponentParser };