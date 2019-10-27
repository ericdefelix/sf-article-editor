import ContentBlocks from '../ContentBlocks';

export function nodeMetadata(componentType, contentBlock, contentHTML) {
  const
    normaliseHTMLString = (str) => {
      return str.replace(/\s{2,10}/g, ' ');
    },

    removeTinyMceAttributes = (contentBlock, clone) => {
      clone.querySelectorAll('[contenteditable="true"]').forEach(function (element) {
        element
          .removeAttribute('id')
          .removeAttribute('contentEditable')
          .removeAttribute('style')
          .removeAttribute('spellcheck');

        if (element.classList.contains('mce-content-body')) { element.classList.remove('mce-content-body'); }
      });

      return clone.outerHTML;
    },

    sanitizeContentBlock = (componentType, contentBlock) => {
      let toBeSanitizedHTML;

      const
        canvasContentSnippet = contentBlock.querySelector('.canvas-content-snippet'),
        clone = canvasContentSnippet.firstElementChild.cloneNode(true);

      toBeSanitizedHTML = componentType == 'textEditor' ?
        canvasContentSnippet.innerHTML : removeTinyMceAttributes(contentBlock, clone);

      return normaliseHTMLString(toBeSanitizedHTML);
    };

  return ContentBlocks.elems[componentType].hasChildContent ?
    { html: normaliseHTMLString(contentHTML), subnodes: [] } :
    { html: sanitizeContentBlock(componentType, contentBlock) };
}