import TextContent, { TextContentLabel } from './text-content';
import Info, { InfoLabel } from './info';
import Tips, { TipsLabel } from './tips';
import StyledLists, { StyledListsLabel } from './styled-lists';
import Tabs, { TabsLabel } from './tabs';
import Accordion, { AccordionLabel } from './accordion';

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

export { ComponentTypes, Components };