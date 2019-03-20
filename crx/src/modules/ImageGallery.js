module.exports = {
  container: null,
  data: [],
  listeners: () => {
    document.getElementById('btnCloseImgGallery').onclick = function () {
      module.exports.toggle_view('hide');
    };

    const imgs = document.querySelectorAll('.img-gallery-item');
    for (let index = 0; index < imgs.length; index++) {
      const img = imgs[index];
      img.onclick = module.exports.select_value;
    }
  },
  template: (imgArray) => {
    const renderList = (imgArray) => {
      let tmpl = `
        <div class="img-gallery-list">
          <label>Select Image</label>
          <button type="button" id="btnCloseImgGallery" class="canvas-btn canvas-btn-xs">
          <span style="font-size: 2em;">×</span></button>
          <div class="img-gallery-scroll">`;

      for (let index = 0; index < imgArray.length; index++) {
        const element = imgArray[index];
        tmpl += `<div class="img-gallery-item" data-value="${element.src}">
          <div class="img-gallery-thumbnail" style="background-image: url(${element.src});"></div>
          <span class="img-gallery-label">${element.alt}</span>
          </div>`;
      }

      return tmpl + '</div></div>';
    };

    return renderList(imgArray);
  },
  select_value: function () {
    const filepickerInput = document.querySelector('.mce-filepicker .mce-textbox');
    filepickerInput.value = this.getAttribute('data-value');

    module.exports.toggle_view('hide');

    console.log(this.getAttribute('data-value'));
  },
  toggle_view: (state) => {
    module.exports.container.style.display = state == 'show' ? 'block' : 'none';

    // Get highest z-index
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

    if (state == 'show' && module.exports.container !== null) {
      module.exports.container.style.zIndex = getZindex(module.exports.container);
    }
  },
  render: () => {
    document.body.getElementById('modalImageGallery').innerHTML = module.exports.template(module.exports.data);
  },
  run: (imgArray) => {
    module.exports.data = imgArray;

    if (module.exports.container === null) {
      const tmpl = `<div class="modal-editor-image-gallery" id="modalImageGallery">${module.exports.template(imgArray)}</div>`;
      document.body.insertAdjacentHTML('beforeend', tmpl); 
      module.exports.listeners();
      module.exports.container = document.getElementById('modalImageGallery');
      module.exports.toggle_view('hide');
    }
    else {
      module.exports.toggle_view('show');
    }
  }
};