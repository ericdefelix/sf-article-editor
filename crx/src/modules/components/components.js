import TextContent, { TextContentLabel, ParseHTML as TextContentParser } from './text-content';
import Info, { InfoLabel, ParseHTML as InfoParser } from './info';
import Tips, { TipsLabel, ParseHTML as TipsParser } from './tips';
import StyledLists, { StyledListsLabel, ParseHTML as StyledListsParser } from './styled-lists';

import
  Tabs, {
  TabsLabel,
  ParseHTML as TabsParser,
} from './tabs';

import
  Accordion, {
  AccordionLabel,
  ParseHTML as AccordionParser,
} from './accordion';

const ComponentTypes = {
  [TextContent.name]: TextContentLabel,
  [Info.name]: InfoLabel,
  [Tips.name]: TipsLabel,
  [StyledLists.name]: StyledListsLabel,
  [Tabs.name]: TabsLabel,
  [Accordion.name]: AccordionLabel
};
const Components = {
  TextContent,
  Info,
  Tips,
  StyledLists,
  Tabs,
  Accordion
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

export {
  ComponentTypes,
  Components,
  ComponentParser,
  TextContentParser,
  // InfoParser,
  // TipsParser,
  // StyledListsParser,
  // TabsParser,
  // AccordionParser
};