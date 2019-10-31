export function GenerateSanitisedHTML(canvasContainer, htmlSection) {
  htmlSection.innerHTML = '';

  if (!canvasContainer.children.length) {
    htmlSection.innerHTML = '<strong>Nothing to display here.</strong>';
  }
  else {
    const previewClone = canvasContainer.cloneNode(true);

    [...previewClone.children].forEach(element => {
      if (element.querySelector('.canvas-subcontainer') !== null) {
        element.querySelectorAll('.canvas-subcontainer').forEach(elementHasNested => {
          if (elementHasNested.querySelector('.canvas-content-block') !== null) {
            [...elementHasNested.children].forEach(nestedSubelement => {
              elementHasNested.parentElement.appendChild(nestedSubelement.querySelector('.canvas-content-snippet').lastElementChild);
            }); 
          }

          elementHasNested.nextElementSibling.remove();
          elementHasNested.remove();
        });
      }
      
      if (element.querySelector('[contenteditable="true"]') !== null) {
        element.querySelectorAll('[contenteditable="true"]').forEach(editable => {
          const attrs = ['contentEditable', 'id', 'style', 'spellCheck'];
          attrs.forEach(attr => editable.removeAttribute(attr));
          if (editable.classList.value.includes('mce-content-body')) editable.classList.remove('mce-content-body');
        });
      }

      htmlSection.appendChild(element.querySelector('.canvas-content-snippet').lastElementChild);

      // if (htmlSection.lastElementChild.className === 'sf-tabs') {
      //   htmlSection.lastElementChild.querySelector('.sf-tab-item:first-child .sf-tab-item-link').click();
      // }
      // TODO: 


      if (htmlSection.querySelector('.sf-tabs') !== null) {
        htmlSection.querySelectorAll('.sf-tab-item-link').forEach(link => {
          const targetLinkSectionID = link.id.split('target_')[1];
          link.id = link.id + 'preview';
          htmlSection.querySelector(`#${targetLinkSectionID}`).id = htmlSection.querySelector(`#${targetLinkSectionID}`).id + `preview`;
        });
      }
    });
  }
}