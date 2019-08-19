import { TextContentLabel, ParseHTML as TextContentParser } from './text-content';
import { InfoLabel, ParseHTML as InfoParser } from './info';
import { TipsLabel, ParseHTML as TipsParser } from './tips';
import { StyledListsLabel, ParseHTML as StyledListsParser } from './styled-lists';
import { TabsLabel, ParseHTML as TabsParser, } from './tabs';
import { AccordionLabel, ParseHTML as AccordionParser, } from './accordion';

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
    data = AccordionParser.parse(currentNode);
  } else if (TabsParser.isTrue(currentNode)) {
    data = TabsParser.parse(currentNode);
  } else if (StyledListsParser.isTrue(currentNode)) {
    data = StyledListsParser.parse(currentNode);
  } else if (TipsParser.isTrue(currentNode)) {
    data = TipsParser.parse(currentNode);
  } else if (InfoParser.isTrue(currentNode)) {
    data = InfoParser.parse(currentNode);
  } else {
    data = TextContentParser.parse(currentNode);
  }
  return data;
};

export { ComponentTypes, ComponentParser, TextContentParser };