import TextContent, { TextContentLabel, ParseHTML as TextContentParser } from './text-content';
import Info, { InfoLabel, ParseHTML as InfoParser } from './info';
import Tips, { TipsLabel, ParseHTML as TipsParser } from './tips';
import StyledLists, { StyledListsLabel, ParseHTML as StyledListsParser } from './styled-lists';
import Tabs, { TabsLabel, ParseHTML as TabsParser } from './tabs';
import Accordion, { AccordionLabel, ParseHTML as AccordionParser } from './accordion';

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
const ComponentParser = {
  TextContentParser,
  InfoParser,
  TipsParser,
  StyledListsParser,
  TabsParser,
  AccordionParser
};

export { ComponentTypes, Components, ComponentParser };