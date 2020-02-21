/* eslint-disable quotes */
import {
  ImageGalleryEmpty,
  ImageGalleryItemTemplate,
  ImageGalleryTemplate
} from "../modules/utils/interfaceTemplates";

const ImageGallery = {
  container: null,
  scroll: null,
  init: (params) => {
    document.querySelector('body').insertAdjacentHTML('beforeend', ImageGalleryTemplate());
    ImageGallery.container = document.getElementById('modalImageGallery');
    ImageGallery.listeners();
    ImageGallery.render(params.data);
  },
  listeners: () => {
    document.getElementById('btnCloseImgGallery').onclick = ImageGallery.toggle_view;

    const imageGalleryListObserver = new MutationObserver(mutations => {
      if (mutations.length > 0 && mutations[0].addedNodes.length > 0) {        
        [...mutations[0].addedNodes].forEach(img => {
            img.onclick = ImageGallery.select_value;
        }); 
      }
    });
    
    imageGalleryListObserver.observe(
      document.getElementById('imgGalleryScroll'),
      {
        attributes: false,
        subtree: false,
        childList: true
      }
    );

    document.addEventListener('click', (event) => {
      const t = event.target;
      if (t.classList.value.includes('mce-i-browse') ||
        (t.parentNode.nodeName === 'BUTTON' && t.id.includes('-action') &&
          t.classList.value.includes('mce-open'))
      ) {
        ImageGallery.toggle_view();
      }
    });

  },
  render: (data) => {
    document
      .getElementById('imgGalleryScroll')
      .insertAdjacentHTML(
        'afterbegin',
        data.length ? ImageGalleryItemTemplate(data) : ImageGalleryEmpty()
      );
  },
  select_value: function () {
    const filepickerInput = document.querySelector('.mce-filepicker .mce-textbox');
    filepickerInput.value = this.getAttribute('data-value');
    ImageGallery.toggle_view();
  },
  toggle_view: () => {
    const getZindex = (elem) => {
      let highestZindex = 0;
      let sibling = elem.parentNode.firstChild;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
          highestZindex = sibling.style.zIndex >= highestZindex ? sibling.style.zIndex : 0;
        }
        sibling = sibling.nextSibling;
      }
      return highestZindex;
    };

    ImageGallery.container.style.display = ImageGallery.container.style.display === 'none' ? 'block' : 'none';

    if (ImageGallery.container.style.display === 'block') {
      ImageGallery.container.style.zIndex = getZindex(ImageGallery.container);
    }
  }
};

export default ImageGallery;