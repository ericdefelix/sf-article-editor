export function GenerateSanitisedHTML(canvasContainer, htmlSection, sourceSection) {
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

      if (element.querySelector('.sf-tabs') !== null) {
        element.querySelectorAll('.sf-tabs').forEach(tab => {
          tab.querySelector('.sf-tab-nav .sf-tab-item:first-child .sf-tab-item-link').click();
          // console.log(tab.querySelector('.sf-tab-nav .sf-tab-item:first-child .sf-tab-item-link'));
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

      sourceSection.value = htmlSection.innerHTML;

      if (htmlSection.querySelector('.sf-tabs') !== null) {
        htmlSection.querySelectorAll('.sf-tab-item-link').forEach(link => {
          const targetLinkSectionID = link.id.split('target_')[1];
          link.id = link.id + 'preview';
          htmlSection.querySelector(`#${targetLinkSectionID}`).id = htmlSection.querySelector(`#${targetLinkSectionID}`).id + `preview`;
        });
      }
    });
  }

  // const nodeLevel1Children = previewClone.children;
  // const div = document.createElement('div');
  
  // [...nodeLevel1Children].forEach(child => {
  //   console.log(child);
    
  //   const subcontainer = child.querySelectorAll('.canvas-content-snippet > .canvas-subcontainer');

  //   if (subcontainer.length > 0) extractSubcontainerElements(subcontainer);
    
  //   child.querySelectorAll('[contenteditable="true"]').forEach(element => {
  //     const attrs = ['contentEditable', 'id', 'style', 'spellCheck'];
  //     attrs.forEach(attr => element.removeAttribute(attr));
  //     if (element.classList.value.includes('mce-content-body')) element.classList.remove('mce-content-body');
  //   });
    
  //   div.appendChild(child.querySelector('.canvas-content-snippet').lastElementChild);
  // });

  // data.preview = div;

  // data.preview.querySelectorAll('.sf-tab-item-link').forEach(link => {
  //   const targetLinkSectionID = link.id.split('target_')[1];
    
  //   link.id = `preview_${link.id}`;
  //   document.getElementById(targetLinkSectionID).id = `preview_${targetLinkSectionID}`;
  // });

  // data.raw = div.innerHTML;
  // return data;
}