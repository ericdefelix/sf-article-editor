import Sortable from '../../../node_modules/sortablejs/Sortable.min';

export function UserInterfaceSortable(config) {
  const sortableConfig = {
    sort: true,
    touchStartThreshold: 5,
    filter: '[data-content="empty"]',
    chosenClass: 'canvas-content-chosen',
    ghostClass: 'canvas-content-ghost',
    dragClass: 'canvas-content-dragging',
    animation: 300,
    easing: 'cubic-bezier(1, 0, 0, 1)',
    handle: `${config.contentDraggableClass}`,
    direction: 'vertical'
  };

  new Sortable(config.container, sortableConfig);
};

export function AccordionSortable({container, contentDraggableClass}) {
  console.log('dragging');
  const sortableConfig = {
    sort: true,
    touchStartThreshold: 5,
    filter: '[data-content="empty"]',
    chosenClass: 'canvas-content-chosen',
    ghostClass: 'canvas-content-ghost',
    dragClass: 'canvas-content-dragging',
    animation: 300,
    handle: contentDraggableClass,
    easing: 'cubic-bezier(1, 0, 0, 1)',
    direction: 'vertical'
  };

  new Sortable(container, sortableConfig);
};