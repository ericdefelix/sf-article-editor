!function(t){function e(e){for(var a,c,r=e[0],l=e[1],s=e[2],u=0,m=[];u<r.length;u++)c=r[u],o[c]&&m.push(o[c][0]),o[c]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(t[a]=l[a]);for(d&&d(e);m.length;)m.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],a=!0,r=1;r<n.length;r++){var l=n[r];0!==o[l]&&(a=!1)}a&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var a={},o={0:0},i=[];function c(e){if(a[e])return a[e].exports;var n=a[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=a,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)c.d(n,a,function(e){return t[e]}.bind(null,a));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="";var r=window.webpackJsonp=window.webpackJsonp||[],l=r.push.bind(r);r.push=e,r=r.slice();for(var s=0;s<r.length;s++)e(r[s]);var d=l;i.push([93,1]),n()}({1:function(t,e){t.exports={elems:{textEditor:{ui_label:"Text Editor",template:function(t){var e=void 0!==t?t.value:"<p>Click here to start editing</p>";return'<div class="sf-editor-content">'.concat(e,"</div>")},hasChildContent:!1,contentEditorBindToElem:"container",contentEditorConfig:{plugins:"lists link image table imagetools",toolbar:"undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist"}},styledLists:{ui_label:"Styled Lists",template:function(t){var e=void 0===t?"ol":t;return"\n\t\t\t\t\t<".concat(e,' class="sf-list-bullet-circular">\n\t\t\t\t\t\t<li>Click here to start editing list</li>\n\t\t\t\t\t\t<li>Or paste content here.</li>\n\t\t\t\t\t</').concat(e,">")},hasChildContent:!1,contentEditorBindToElem:"container",contentEditorConfig:{plugins:"lists link image table imagetools",toolbar:"undo redo | numlist bullist | link image imageupload table | bold italic strikethrough"}},blockQuotes:{ui_label:"Block Quotes",types:[{ui_label:"Info",ui_value:"info"},{ui_label:"Tip",ui_value:"tip"},{ui_label:"Attention",ui_value:"alert"}],template:function(t){var e=function(){var e=void 0===t?"Click here to edit heading":t.variables[0];return e},n=function(){var e=void 0===t?"Click here to edit/paste content":t.variables[1];return e};return'\n\t\t\t\t<div class="sf-blockquote sf-blockquote-'.concat(function(){return"info"}(),'" role="blockquote">\n\t\t\t\t\t<div class="sf-blockquote-addon"></div>\n\t\t\t\t\t<div class="sf-blockquote-content">\n\t\t\t\t\t\t<h5 class="sf-blockquote-content-header">').concat(e(),'</h5>\n\t\t\t\t\t\t<div class="sf-blockquote-content-body">\n\t\t\t\t\t\t\t').concat(n(),"\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>")},hasChildContent:!1,contentEditorBindToElem:"content",contentEditorConfig:{plugins:"link image table",toolbar:"undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table"}},wellContainer:{ui_label:"Generic Box",template:function(t){return'\n\t\t\t\t\t<div class="sf-well">\n\t\t\t\t\t\t<h5 class="sf-well-heading">Click here to edit heading</h5>\n\t\t\t\t\t\t<div class="sf-well-body"><p>Click here to edit/paste content.</p></div>\n\t\t\t\t\t</div>'},hasChildContent:!1,contentEditorBindToElem:"content",contentEditorConfig:{plugins:"link image table",toolbar:"undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table"}},genericTabs:{ui_label:"Generic Tabs",template:function(t){var e,n="",a="",o=function(){return Math.floor(9e4*Math.random())+1e4},i=[{label:"Desktop",id:o(),content:[]},{label:"Web",id:o(),content:[]},{label:"Mobile",id:o(),content:[]}],c=void 0!==t;e=c?t.subnodes:i;for(var r=0;r<=e.length-1;r++){var l=e[r].id,s=e[r].label;n+='\n\t\t\t\t\t\t<li class="sf-tab-item'.concat(0==r?" active":"",'">\n\t\t\t\t\t\t\t<span class="sf-tab-item-link" id="target_tab-').concat(l,'">').concat(s,"</span>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t"),a+='<div class="sf-tab-content'.concat(0==r?" in":"",'" id="tab-').concat(l,'">').concat(c?"{{ tab-"+l+" }}":"","</div>")}return'\n\t\t\t\t\t<div class="sf-tabs">\n\t\t\t\t\t\t<div class="sf-tabs-bar"><ul class="sf-tab-nav">'.concat(n,"</ul></div>").concat(a,"\n\t\t\t\t\t</div>\n\t\t\t\t")},contentEditorBindToElem:"none",hasChildContent:!0}},keywords:["sf-blockquote","sf-list-bullet-circular","sf-well","sf-tabs","sf-editor-content"],keyword_map:{"sf-blockquote":"blockQuotes","sf-list-bullet-circular":"styledLists","sf-well":"wellContainer","sf-tabs":"genericTabs","sf-editor-content":"textEditor"},getTemplate:function(t,e){return this.elems[t].template(e)}}},13:function(t,e){t.exports={canvasContainer:document.getElementById("canvasContainer"),render:function(t,e){this[t](e)},toolbox:function(t){var e='<div class="toolbox" id="toolbox"><ul class="toolbox-toolbar" id="toolbar" tabIndex="-1">';for(key in t)e+='<li class="toolbar-item" data-action="add-component" data-ui-label="'.concat(key,'">\n\t\t\t\t<small>').concat(t[key].ui_label,"</small>\n\t\t\t</li>");this.canvasContainer.insertAdjacentHTML("beforeend",e+"</ul></div>")},canvas:function(e){var n=e.data.length,a=e.data,o=e.trigger,i=e.dependencies[0],c=e.dependencies[1],r=document.querySelector('[data-content="empty"]');if("auto"==o){var l;l=n>0?function(){var e="";try{for(var n=0;n<=a.length-1;n++){var o,r=a[n].id,l=a[n].type,s=a[n].metadata,d=void 0;if(o={id:r,type:l,data:i.elems[l]},s.hasOwnProperty("subnodes")&&s.subnodes.length>0){d=i.elems[l].template({subnodes:s.subnodes});for(var u=t.exports.renderContentBlock(o,d,void 0),m=0;m<=s.subnodes.length-1;m++){var p=s.subnodes[m],g="";if(p.content.length>0)for(var b=0;b<=p.content.length-1;b++){var f={type:p.content[b].type,id:p.content[b].id,data:i.elems[p.content[b].type]},v=i.elems[p.content[b].type].template();g+=t.exports.renderContentBlock(f,v,p.id)}u=c(u,"{{ tab-"+p.id+" }}",g)}e+=u}else d=s.html,e+=t.exports.renderContentBlock(o,d,void 0)}}catch(t){console.log(t),console.log("ContentBlocks module is missing")}return e}():'\n      <section class="canvas-content-block" data-content="empty"> \n        <img src="images/empty-icon.svg" alt="Empty">\n        <h4 class="empty-text">There\'s nothing in here.<br><small>Start building your content.</small></h4>\n        <div class="canvas-add-component">\n          <button type="button" class="canvas-btn canvas-btn-primary" data-action="select-component">\n            Add Content Block\n          </button>\n        </div>\n      </section>',this.canvasContainer.innerHTML=l}if("user"==o&&(0==n&&this.canvasContainer.insertAdjacentHTML("afterbegin",'\n      <section class="canvas-content-block" data-content="empty"> \n        <img src="images/empty-icon.svg" alt="Empty">\n        <h4 class="empty-text">There\'s nothing in here.<br><small>Start building your content.</small></h4>\n        <div class="canvas-add-component">\n          <button type="button" class="canvas-btn canvas-btn-primary" data-action="select-component">\n            Add Content Block\n          </button>\n        </div>\n      </section>'),1==n&&r)){var s=document.getElementById("toolbox");s.parentNode.removeChild(s),this.canvasContainer.removeChild(r),this.canvasContainer.appendChild(s)}e.hasOwnProperty("callback")&&e.callback()},content:function(e){var n,a,o=e.trigger.closest(".canvas-content-block"),i=o.getAttribute("data-content"),c=document.getElementById("toolbox").previousElementSibling.classList.contains("forTabs"),r=e.data.template();if("empty"===i)n=t.exports.renderContentBlock(e,r,void 0),this.canvasContainer.insertAdjacentHTML("beforeend",n);else if(c){var l=o.querySelector(".sf-tab-content.in").getAttribute("id");n=t.exports.renderContentBlock(e,r,l);var s=o.querySelector(".sf-tab-content.in");s.getAttribute("id");0==s.childNodes.length?s.innerHTML=n:s.insertAdjacentHTML("beforeend",n)}else n=t.exports.renderContentBlock(e,r,void 0),o.insertAdjacentHTML("afterend",n);a=document.querySelectorAll("#"+e.id+' .canvas-add-component [data-action="select-component"]'),e.callback(a)},renderContentBlock:function(e,n,a){return'\n    <section class="canvas-content-block" id="'.concat(e.id,'">\n      <div class="canvas-content-config"> \n        <span class="canvas-content-draggable \n          ').concat(void 0===a?"canvasDraggableMain":"canvasDraggableSub_tab-"+a,'"></span>\n        ').concat(e.data.hasOwnProperty("types")?t.exports.renderOptions(e):"","\n        ").concat(e.data.hasChildContent?'<button class="canvas-btn canvas-btn-xs" \n            data-action="edit-tab"\n            data-target="snippet-'.concat(e.id,'" data-target-type="').concat(e.type,'">Edit Tabs</button>'):"",'\n        <button class="canvas-btn canvas-btn-xs" \n          data-action="remove-component"\n          data-target="').concat(e.id,'" data-target-type="').concat(e.type,'">\n          <i class="icon-delete"></i> Remove\n        </button>\n      </div>\n      <div class="canvas-content-snippet" id="snippet-').concat(e.id,'" data-component-type="').concat(e.type,'">\n        ').concat(n,"\n      </div>\n      ").concat(e.data.hasChildContent?t.exports.renderAddSubContent():"","\n      ").concat(void 0===a?t.exports.renderAddMainContent():"","\n    </section>")},renderOptions:function(t){for(var e="",n=0;n<=t.data.types.length-1;n++)e+='<option value="'.concat(t.data.types[n].ui_value,'">').concat(t.data.types[n].ui_label,"</option>");return'<select class="canvas-form-control" name="s-'.concat(t.id,'" data-target="snippet-').concat(t.id,'">').concat(e,"</select>")},renderAddSubContent:function(){return'\n    <div class="canvas-add-component canvas-add-subcontent">\n      <button type="button" class="canvas-btn canvas-btn-xs btn-has-text forTabs" data-action="select-component">\n        <i class="icon-plus">&#43;</i> Add Content to this tab\n      </button>\n    </div>\n    '},renderAddMainContent:function(){return'\n      <div class="canvas-content-action canvas-add-component">\n        <div class="content-action-hotspot">\n          <button type="button" class="canvas-btn canvas-btn-xs" data-action="select-component">\n            <i class="icon-plus">&#43;</i>\n          </button>\n        </div>\n      </div>\n    '},update:function(){}}},36:function(t,e){t.exports={container:null,data:[],listeners:function(){document.getElementById("btnCloseImgGallery").onclick=function(){t.exports.toggle_view("hide")};for(var e=document.querySelectorAll(".img-gallery-item"),n=0;n<e.length;n++){e[n].onclick=t.exports.select_value}},template:function(t){return function(t){for(var e='\n        <div class="img-gallery-list">\n          <label>Select Image</label>\n          <button type="button" id="btnCloseImgGallery" class="canvas-btn canvas-btn-xs">\n          <span style="font-size: 2em;">×</span></button>\n          <div class="img-gallery-scroll">',n=0;n<t.length;n++){var a=t[n];e+='<div class="img-gallery-item" data-value="'.concat(a.src,'">\n          <div class="img-gallery-thumbnail" style="background-image: url(').concat(a.src,');"></div>\n          <span class="img-gallery-label">').concat(a.alt,"</span>\n          </div>")}return e+"</div></div>"}(t)},select_value:function(){document.querySelector(".mce-filepicker .mce-textbox").value=this.getAttribute("data-value"),t.exports.toggle_view("hide")},toggle_view:function(e){t.exports.container.style.display="show"==e?"block":"none";"show"==e&&null!==t.exports.container&&(t.exports.container.style.zIndex=function(t){for(var e=0,n=t.parentNode.firstChild;n;)1===n.nodeType&&n!==t&&(e=n.style.zIndex>=e?n.style.zIndex:0),n=n.nextSibling;return e}(t.exports.container))},render:function(){document.body.getElementById("modalImageGallery").innerHTML=t.exports.template(t.exports.data)},run:function(e){if(t.exports.data=e,null===t.exports.container){var n='<div class="modal-editor-image-gallery" id="modalImageGallery">'.concat(t.exports.template(e),"</div>");document.body.insertAdjacentHTML("beforeend",n),t.exports.listeners(),t.exports.container=document.getElementById("modalImageGallery"),t.exports.toggle_view("hide")}else t.exports.toggle_view("show")}}},77:function(t,e,n){},93:function(t,e,n){"use strict";n.r(e);n(37),n(30),n(49),n(53),n(54),n(77),n(55),n(56);function a(t){return t.replace(/\s{2,10}/g," ")}function o(){return Math.random().toString(36).replace(/[^a-z]+/g,"").substr(2,10)}n(79),n(80),n(86),n(87),n(88);function i(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function r(t,e){for(var n=function(){return{id:e.GenerateID(),type:"",metadata:{html:""}}},a=function(t){for(var n=t.split(" "),a="",o=0;o<n.length;o++)if(-1!==e.ContentBlocks.keywords.indexOf(n[o])){a=e.ContentBlocks.keyword_map[n[o]];break}return a},o=function(t){try{return t instanceof HTMLElement}catch(e){return"object"===c(t)&&1===t.nodeType&&"object"===c(t.style)&&"object"===c(t.ownerDocument)}},r=i(t),l=[],s=!0,d=function(t){return 0==l.length||("textEditor"!=l[l.length-1].type||"textEditor"!=t)},u=function(t){var i=r[t],c=(i.nodeType,void 0),u=n();if(!o(i)&&!i.nodeValue||/^\s*$/.test(i.nodeValue))return"continue";o(i)?(i.hasAttribute("class")&&function(t){for(var n=t.split(" "),a=!1,o=0;o<n.length;o++)if(-1!==e.ContentBlocks.keywords.indexOf(n[o])){a=!0;break}return a}(i.classList.value)?(u.type=a(i.classList.value),s=d(u.type),e.ContentBlocks.elems[a(i.classList.value)].hasChildContent&&(u.metadata.subnodes=[],c=i.outerHTML,i.querySelectorAll(".sf-tab-item-link").forEach(function(t,e){var o=t.textContent,c=t.getAttribute("id").split("target_")[1],r=i.querySelector("#"+c);if(u.metadata.subnodes.push({label:o,id:c.split("tab-")[1],content:[]}),null!=r.firstChild){var l=r.children,d=!0,m=!1,p=void 0;try{for(var g,b=l[Symbol.iterator]();!(d=(g=b.next()).done);d=!0){var f=g.value,v=n();s=!0,v.type=a(f.classList.value),v.metadata.html=f.outerHTML,u.metadata.subnodes[e].content.push(v)}}catch(t){m=!0,p=t}finally{try{d||null==b.return||b.return()}finally{if(m)throw p}}}}))):(u.type="textEditor",s=d("textEditor")),c=i.outerHTML):(u.type="textEditor",s=d("textEditor"),c=i.nodeValue),u.metadata.html=c,s?l.push(u):l[l.length-1].metadata.html+=c},m=0;m<r.length;m++)u(m);return l}var l=n(1),s=n.n(l),d=n(13),u=n.n(d),m=n(61),p=n.n(m),g=n(36),b=n.n(g),f=[{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9P"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9P"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9P"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"},{alt:"User-added image",src:"https://leap--uxui--c.cs101.content.force.com/servlet/rtaImage?eid=ka01X0000000569&amp;feoid=00N1X000000Qsg8&amp;refid=0EM1X0000004H9U"}],v={crxID:"",contentEditorInstanceId:"",instanceHTML:"",outputPane:document.getElementById("outputContainer"),htmlSection:document.getElementById("htmlOutputContainer"),sourceSection:document.getElementById("viewSourcePreview"),btnPreview:document.getElementById("btnPreview"),btnSave:document.getElementById("btnSave"),btnClose:document.getElementById("btnCloseOutputContainer"),btnThemeSelector:document.getElementById("btnThemeSelector"),toggleView:document.getElementById("outputContainerToggleView"),existing_data:[],image_gallery:[],toolbox:void 0,init:function(){try{chrome.storage.sync.get(["contentEditorInstanceId"],function(t){v.contentEditorInstanceId=t.contentEditorInstanceId,v.btnSave.setAttribute("data-target",v.contentEditorInstanceId),v.crxID=chrome.runtime.id}),chrome.storage.sync.get(["instanceHTML"],function(t){var e=t.instanceHTML;""===e&&void 0===e||(v.htmlSection.insertAdjacentHTML("afterbegin",e),v.existing_data=r(v.htmlSection.childNodes,{GenerateID:o,ContentBlocks:s.a}),v.start_app())}),chrome.storage.sync.get(["image_gallery"],function(t){v.image_gallery=JSON.parse(t.image_gallery),b.a.run(v.image_gallery)})}catch(t){v.image_gallery=f,v.htmlSection.insertAdjacentHTML("afterbegin",""),v.existing_data=r(v.htmlSection.childNodes,{GenerateID:o,ContentBlocks:s.a}),v.start_app(),console.log("Attempting to do a chrome api method. You are in stand-alone mode")}},start_app:function(){v.build_ui(),v.init_sortable({container:document.getElementById("canvasContainer"),contentDraggableClass:".canvasDraggableMain"}),v.btnPreview.onclick=v.generate_html,v.btnSave.onclick=v.save_html,v.toggleView.onchange=v.html_view,v.btnClose.onclick=v.close_preview,v.btnThemeSelector.onchange=v.select_theme},build_ui:function(){u.a.render("canvas",{data:v.existing_data,trigger:"auto",dependencies:[s.a,function(t,e,n){return t.replace(e,n)}],callback:function(){var t;u.a.render("toolbox",s.a.elems),document.querySelectorAll('[data-action="select-component"]').forEach(function(t,e){t.onclick=v._bindEvtDisplayToolbox}),document.querySelectorAll('[data-action="add-component"]').forEach(function(t,e){t.onclick=v._bindEvtAddComponent}),document.querySelectorAll('[data-action="remove-component"]').forEach(function(t,e){t.onclick=v._bindEvtRemoveComponent}),(t=document.getElementById("canvasContainer").querySelectorAll(".canvas-content-block")).length>0&&t.forEach(function(t,e){if("empty"!==t.getAttribute("data-content")){var n=t.getAttribute("id"),a=t.querySelector(".canvas-content-snippet").getAttribute("data-component-type");v.handleEditEventsToDOM(n,a)}}),document.addEventListener("click",function(t){null===function(t,e){for(Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(t){for(var e=(this.document||this.ownerDocument).querySelectorAll(t),n=e.length;--n>=0&&e.item(n)!==this;);return n>-1});t&&t!==document;t=t.parentNode)if(t.matches(e))return t;return null}(t.target,".canvas-add-component")&&toolbox.classList.remove("in")},!1),v.togglePageButtons()}})},_bindEvtDisplayToolbox:function(){var t=document.getElementById("toolbox");t.classList.remove("in"),t.style.display="block",this.parentElement.appendChild(t);var e=t.offsetWidth,n=this.parentElement.classList.contains("canvas-add-subcontent");t.style.left=n?"0":"calc(50% - "+(e/2+4)+"px)",t.classList.contains("in")?t.classList.remove("in"):t.classList.add("in"),t.focus()},_bindEvtAddComponent:function(){var t=o(),e=this.getAttribute("data-ui-label");0===v.existing_data.length&&v.existing_data.push({}),u.a.render("content",{id:t,type:e,data:s.a.elems[e],trigger:this,callback:function(n){v.handleEditEventsToDOM(t,e),n.forEach(function(t,e){t.onclick=v._bindEvtDisplayToolbox}),document.querySelector('[data-action="remove-component"][data-target="'+t+'"]').onclick=v._bindEvtRemoveComponent,u.a.render("canvas",{data:v.existing_data,dependencies:[],trigger:"user"}),v.updateData(),v.togglePageButtons()}})},_bindEvtSelectionDropdown:function(){var t=this.value,e=this.getAttribute("data-target"),n=document.getElementById(e).firstElementChild;n.className="sf-blockquote",n.classList.add("sf-blockquote-"+t)},_bindEvtHeaderInput:function(){""==this.textContent&&(this.textContent="Click here to edit heading")},_bindEvtRemoveComponent:function(){var t=this.getAttribute("data-target"),e=document.getElementById("canvasContainer"),n=document.getElementById(t),a=document.getElementById("toolbox");a.classList.remove("in"),a.style.display="block",e.appendChild(a),n.remove(),v.updateData(),0===v.existing_data.length&&(u.a.render("canvas",{data:v.existing_data,dependencies:[],trigger:"user"}),e.querySelector('[data-action="select-component"]').onclick=v._bindEvtDisplayToolbox)},_bindEvtEditTabs:function(){var t=document.getElementById(this.getAttribute("data-target"));this.classList.contains("canvas-btn-primary")?(this.textContent="Edit Tabs",this.classList.remove("canvas-btn-primary"),v.btnSave.disabled=!1,v.btnPreview.disabled=!1,t.querySelectorAll(".sf-tab-item-link").forEach(function(t,e){t.contentEditable=!1,t.removeAttribute("contentEditable"),t.parentElement.classList.remove("edit-mode")})):(this.textContent="Save",this.classList.add("canvas-btn-primary"),v.btnSave.disabled=!0,v.btnPreview.disabled=!0,t.querySelectorAll(".sf-tab-item-link").forEach(function(t,e){var n;(t.contentEditable=!0,t.parentElement.classList.add("edit-mode"),0==e)&&(t.focus(),n=setTimeout(function(){document.execCommand("selectAll",!1,null),clearTimeout(n)},50))}))},togglePageButtons:function(){v.btnPreview.style.display=0==v.existing_data.length?"none":"initial",v.btnSave.style.display=0==v.existing_data.length?"none":"initial"},handleEditEventsToDOM:function(t,e){var n=document.getElementById("snippet-"+t),a=s.a.elems[e].contentEditorBindToElem,o=function(t,e,n){var a=document.querySelector("#snippet-"+t+" ."+e),o=document.querySelector("#snippet-"+t+" ."+n);a.contentEditable=!0,o.contentEditable=!0,a.onblur=v._bindEvtHeaderInput,o.id="contentEditableBody-"+t};("blockQuotes"==e&&(o(t,"sf-blockquote-content-header","sf-blockquote-content-body",v._bindEvtHeaderInput),document.querySelector('[data-target="snippet-'+t+'"]').onchange=v._bindEvtSelectionDropdown),"wellContainer"==e&&o(t,"sf-well-heading","sf-well-body",v._bindEvtHeaderInput),"genericTabs"==e)&&(n.querySelectorAll(".sf-tab-content").forEach(function(t,e){var n=t.getAttribute("id");v.init_sortable({container:document.getElementById(n),contentDraggableClass:".canvasDraggableSub_"+n})}),document.querySelector('[data-target="snippet-'+t+'"]').onclick=v._bindEvtEditTabs);if("styledLists"!=e&&"textEditor"!=e||(n.contentEditable=!0),"none"!==a){var i="content"==a?"contentEditableBody-"+t:"snippet-"+t;v.init_contentEditor({container:i,value:s.a.elems[e].template(),config:s.a.elems[e].contentEditorConfig})}},init_sortable:function(t){var e={sort:!0,touchStartThreshold:5,filter:'[data-content="empty"]',chosenClass:"canvas-content-chosen",ghostClass:"canvas-content-ghost",dragClass:"canvas-content-dragging",animation:300,easing:"cubic-bezier(1, 0, 0, 1)",handle:t.contentDraggableClass,direction:"vertical",onUpdate:function(){v.updateData(),console.log("list updated")}};new p.a(t.container,e)},init_contentEditor:function(t){var e={selector:"#"+t.container,inline:!0,menubar:!1,default_link_target:"_blank"};e.toolbar=t.config.toolbar,e.plugins=t.config.plugins,-1!==t.config.toolbar.indexOf("image")&&(e.image_title=!0,e.automatic_uploads=!0,e["paste_data_images "]=!0,e.file_picker_types="image",e.file_picker_callback=function(t,e,n){b.a.run(v.image_gallery)}),tinymce.init(e)},updateData:function(){var t=[],e=function(t){var e=t.querySelector(".canvas-content-snippet").firstElementChild.cloneNode(!0);return e.querySelectorAll('[contenteditable="true"]').forEach(function(t){t.removeAttribute("id"),t.removeAttribute("contentEditable"),t.removeAttribute("style"),t.removeAttribute("spellcheck"),t.classList.contains("mce-content-body")&&t.classList.remove("mce-content-body")}),a(e.outerHTML)},n=function(t,n,o){return s.a.elems[t].hasChildContent?{subnodes:[],html:a(o)}:{html:e(n),variables:[]}};document.querySelectorAll("#canvasContainer > .canvas-content-block").forEach(function(e){var a,o,i,c=e.querySelector(".canvas-content-snippet").getAttribute("data-component-type"),r={id:e.getAttribute("id"),type:c,metadata:{}};if(r.metadata=n(c,e,e.querySelector(".canvas-content-snippet").innerHTML),s.a.elems[c].hasChildContent){var l=e.querySelectorAll(".sf-tab-item-link"),d=[];l.forEach(function(t,e){var a=document.getElementById(t.getAttribute("id").split("target_")[1]),o=a.getAttribute("id"),i=t.textContent;if(r.metadata.subnodes.push({label:i,id:o,content:[]}),a.children.length>0){var c=a.querySelectorAll(".canvas-content-block"),l="";c.forEach(function(t){var a=t.getAttribute("id"),o=document.getElementById("snippet-"+a).getAttribute("data-component-type"),i=n(o,t,"");r.metadata.subnodes[e].content.push({id:a,type:o,metadata:i}),l+=i.html}),d.push(l)}}),r.metadata.html=(a=r.metadata.html,o=d,(i=document.createElement("DIV")).innerHTML=a,i.querySelectorAll(".sf-tab-content").forEach(function(t,e){t.innerHTML=void 0!==o[e]?o[e]:""}),i.innerHTML)}t.push(r)}),v.existing_data=t,console.log(v.existing_data)},html_view:function(){var t=this.value;v.sourceSection.style.display="source"==t?"block":"none",v.htmlSection.style.display="html"==t?"block":"none"},close_preview:function(){v.outputPane.style.display="none"},select_theme:function(){var t=this.value;document.querySelector("body").classList.value="",document.querySelector("body").classList.add("sf-"+t)},generate_html:function(){v.updateData(),v.outputPane.style.display="block";var t="";v.existing_data.forEach(function(e){t+=e.metadata.html}),v.htmlSection.innerHTML=v.existing_data.length>0?t:"<strong>Nothing to display here.</strong>",v.sourceSection.value=v.htmlSection.innerHTML,v.htmlSection.querySelectorAll(".tabs").forEach(function(t,e){t.querySelectorAll(".sf-tab-item-link").forEach(function(e,n){var a=e.getAttribute("id").split("target_")[1];e.setAttribute("id","target_preview_"+a),t.querySelector("#"+a).id="preview_"+a})})},save_html:function(){v.generate_html(),v.outputPane.style.display="none";var t={method:"insertToContentEditor",origin:window.location.origin,crxid:v.crxID,data:{html:v.sourceSection.value,ckeditorIntanceId:this.getAttribute("data-target")}};try{chrome.runtime.sendMessage(v.crxID,t,function(){var t;t=setTimeout(function(){clearTimeout(t),chrome.windows.getCurrent(function(t){chrome.tabs.getSelected(t.id,function(t){chrome.windows.remove(t.windowId)})})},20)})}catch(t){console.log("Attempting to do a chrome api method. Page origin is not via chrome extension")}},run:function(){this.init()}};v.run()}});