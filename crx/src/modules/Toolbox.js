import { ComponentTypes } from './components/componentHelpers';

export const Toolbox = {
  targetNodeLevel: undefined,
  placeholderPointerID: undefined,
  init: () => {
    // Render Toolbox
    const template = Toolbox.render();
    document.getElementById('toolboxPlaceholder').insertAdjacentHTML('beforeend', template);
  },
  render: () => {
    let template = `<div class="toolbox" id="toolbox"><ul class="toolbox-toolbar" id="toolbar" tabIndex="-1">`;

    for (const key in ComponentTypes) {
      template += `<li class="toolbar-item" data-action="add-component" data-ui-label="${key}">
				<small>${ ComponentTypes[key]}</small>
			</li>`;
    }

    return template + `</ul></div>`;
  },
  display: function (btn) {
    const toolbox = document.getElementById('toolbox');
    const container = btn.parentElement;
    toolbox.parentNode.removeChild(toolbox);
    container.appendChild(toolbox);

    toolbox.classList.remove('in');
    toolbox.style.display = 'block';
    toolbox.style.left = 'calc(50% - ' + (toolbox.offsetWidth / 2 + 4) + 'px)';
    toolbox.classList.contains('in') ? toolbox.classList.remove('in') : toolbox.classList.add('in');
    toolbox.focus();
  },
  hide: () => {
    document.getElementById('toolboxPlaceholder').appendChild(document.getElementById('toolbox'));
  }
};