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
    });
  }
}