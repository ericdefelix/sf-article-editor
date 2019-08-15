export function GenerateSanitisedHTML(sourceNode) {
  const previewClone = sourceNode.cloneNode(true);
  const data = { preview: '', raw: '' };
  const nodeLevel1Children = previewClone.children;
  const div = document.createElement('div');
  
  [...nodeLevel1Children].forEach(child => {
    const subcontainer = child.querySelectorAll('.canvas-subcontainer');

    if (subcontainer.length > 0) {
      subcontainer.forEach(container => {
        const subcontainerParent = container.parentElement;
        const subcontainerChildren = container.querySelectorAll('.canvas-content-snippet');
        const tempDiv = document.createElement('div');
        subcontainerChildren.forEach(subElement => {
          tempDiv.appendChild(subElement.lastElementChild);
        });
        
        subcontainerParent.innerHTML = '';
        subcontainerParent.innerHTML = tempDiv.innerHTML;
      });
    }
    
    child.querySelectorAll('[contenteditable="true"]').forEach(element => {
      const attrs = ['contentEditable', 'id', 'style', 'spellCheck'];
      attrs.forEach(attr => element.removeAttribute(attr));
      if (element.classList.value.includes('mce-content-body')) element.classList.remove('mce-content-body');
    });
    
    div.appendChild(child.querySelector('.canvas-content-snippet').lastElementChild);
  });

  data.preview = div;

  data.preview.querySelectorAll('.sf-tab-item-link').forEach(link => {
    const targetLinkSectionID = link.id.split('target_')[1];
    
    link.id = `preview_${link.id}`;
    document.getElementById(targetLinkSectionID).id = `preview_${targetLinkSectionID}`;
  });

  data.raw = div.innerHTML;
  return data;
}