!function(t){function e(e){for(var o,c,l=e[0],r=e[1],s=e[2],u=0,b=[];u<l.length;u++)c=l[u],a[c]&&b.push(a[c][0]),a[c]=0;for(o in r)Object.prototype.hasOwnProperty.call(r,o)&&(t[o]=r[o]);for(d&&d(e);b.length;)b.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],o=!0,l=1;l<n.length;l++){var r=n[l];0!==a[r]&&(o=!1)}o&&(i.splice(e--,1),t=c(c.s=n[0]))}return t}var o={},a={0:0},i=[];function c(e){if(o[e])return o[e].exports;var n=o[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,c),n.l=!0,n.exports}c.m=t,c.c=o,c.d=function(t,e,n){c.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},c.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},c.t=function(t,e){if(1&e&&(t=c(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(c.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)c.d(n,o,function(e){return t[e]}.bind(null,o));return n},c.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return c.d(e,"a",e),e},c.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},c.p="";var l=window.webpackJsonp=window.webpackJsonp||[],r=l.push.bind(l);l.push=e,l=l.slice();for(var s=0;s<l.length;s++)e(l[s]);var d=r;i.push([73,1]),n()}({4:function(t,e){t.exports={elems:{textEditor:{ui_label:"Text Editor",template:function(t){return"\n\t\t\t\t\t<span>Click here to start editing</span>\n\t\t\t\t"},hasChildContent:!1,contentEditorBindToElem:"container",contentEditorConfig:{plugins:"lists link image table",toolbar:"undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table | numlist bullist"}},styledLists:{ui_label:"Styled Lists",template:function(t){var e=void 0===t?"ol":t;return"\n\t\t\t\t\t<".concat(e,' class="list-bullet-circular">\n\t\t\t\t\t\t<li>Click here to start editing list</li>\n\t\t\t\t\t\t<li>Or paste content here.</li>\n\t\t\t\t\t</').concat(e,">")},hasChildContent:!1,contentEditorBindToElem:"container",contentEditorConfig:{plugins:"lists link",toolbar:"undo redo | numlist bullist | link | bold italic strikethrough"}},blockQuotes:{ui_label:"Block Quotes",types:[{ui_label:"Info",ui_value:"info"},{ui_label:"Tip",ui_value:"tip"},{ui_label:"Attention",ui_value:"alert"}],template:function(t){var e=function(){var e=void 0===t?"Click here to edit heading":t.variables[0];return e},n=function(){var e=void 0===t?"Click here to edit/paste content":t.variables[1];return e};return'\n\t\t\t\t<div class="blockquote blockquote-'.concat(function(){return"info"}(),'" role="blockquote">\n\t\t\t\t\t<span class="blockquote-addon">\n\t\t\t\t\t\t<i class="blockquote-icon"></i>\n\t\t\t\t\t</span>\n\t\t\t\t\t<div class="blockquote-content">\n\t\t\t\t\t\t<h5 class="blockquote-content-header">').concat(e(),'</h5>\n\t\t\t\t\t\t<div class="blockquote-content-body">\n\t\t\t\t\t\t\t').concat(n(),"\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>")},hasChildContent:!1,contentEditorBindToElem:"content",contentEditorConfig:{plugins:"link image table",toolbar:"undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table"}},wellContainer:{ui_label:"Generic Box",template:function(t){return'\n\t\t\t\t\t<div class="well">\n\t\t\t\t\t\t<h5 class="well-heading">Click here to edit heading</h5>\n\t\t\t\t\t\t<div class="well-body"><p>Click here to edit/paste content.</p></div>\n\t\t\t\t\t</div>'},hasChildContent:!1,contentEditorBindToElem:"content",contentEditorConfig:{plugins:"link image table",toolbar:"undo redo | formatselect | bold italic strikethrough | alignleft aligncenter alignright alignjustify | link image table"}},genericTabs:{ui_label:"Generic Tabs",template:function(t){var e,n="",o="",a=function(){return Math.floor(9e4*Math.random())+1e4},i=[{label:"Desktop",id:a(),content:[]},{label:"Web",id:a(),content:[]},{label:"Mobile",id:a(),content:[]}],c=void 0!==t;e=c?t.subnodes:i;for(var l=0;l<=e.length-1;l++){var r=e[l].id,s=e[l].label;n+='\n\t\t\t\t\t\t<li class="tab-item'.concat(0==l?" active":"",'">\n\t\t\t\t\t\t\t<a href="#" class="tab-item-link" data-target="tab-').concat(r,'">').concat(s,"</a>\n\t\t\t\t\t\t</li>\n\t\t\t\t\t"),o+='<section class="tab-content'.concat(0==l?" in":"",'" id="tab-').concat(r,'">').concat(c?"{{ tab-"+r+" }}":"","</section>")}return'\n\t\t\t\t\t<div class="tabs">\n\t\t\t\t\t\t<div class="tabs-bar"><ul class="tab-nav">'.concat(n,"</ul></div>").concat(o,"\n\t\t\t\t\t</div>\n\t\t\t\t")},contentEditorBindToElem:"none",hasChildContent:!0}},getTemplate:function(t,e){return this.elems[t].template(e)}}},68:function(t,e,n){},73:function(t,e,n){"use strict";n.r(e);n(42),n(51),n(63),n(40),n(68),n(69),n(71),n(72);function o(t){return t.replace(/\s{2,10}/g," ")}var a=n(4),i=n.n(a),c=n(9),l=n.n(c),r=n(41),s=n.n(r),d={crxID:"",contentEditorInstanceId:"",instanceHTML:"",outputPane:document.getElementById("outputContainer"),htmlSection:document.getElementById("htmlOutputContainer"),sourceSection:document.getElementById("viewSourcePreview"),btnPreview:document.getElementById("btnPreview"),btnSave:document.getElementById("btnSave"),btnClose:document.getElementById("btnCloseOutputContainer"),toggleView:document.getElementById("outputContainerToggleView"),existing_data:[],html_data_json:"",toolbox:void 0,init:function(){try{window.chrome.storage.sync.get(["contentEditorInstanceId"],function(t){d.contentEditorInstanceId=t.contentEditorInstanceId,d.btnSave.setAttribute("data-target",d.contentEditorInstanceId),d.crxID=window.chrome.runtime.id}),window.chrome.storage.sync.get(["instanceHTML"],function(t){var e=t.instanceHTML;if(""!==e||void 0!==e){document.querySelector("body").insertAdjacentHTML("beforeend",'<div id="placeholderHTML" style="display: none;">'+t.instanceHTML+"</div>");var n=document.getElementById("placeholderHTML").querySelector("pre");d.existing_data=null!==n?JSON.parse(n.textContent.replace(/&lt;/g,"<").replace(/&gt;/g,">")):[],d.start_app(),console.log(d.existing_data)}})}catch(t){d.existing_data=[],d.start_app(),console.log("Attempting to do a chrome api method. You are in stand-alone mode")}},start_app:function(){d.build_ui(),d.init_sortable({container:document.getElementById("canvasContainer"),contentDraggableClass:".canvasDraggableMain"}),d.btnPreview.onclick=d.generate_html,d.btnSave.onclick=d.save_html,d.toggleView.onchange=d.html_view,d.btnClose.onclick=d.close_preview},build_ui:function(){l.a.render("canvas",{data:d.existing_data,trigger:"auto",dependencies:[i.a,function(t,e,n){return t.replace(e,n)}],callback:function(){var t;l.a.render("toolbox",i.a.elems),document.querySelectorAll('[data-action="select-component"]').forEach(function(t,e){t.onclick=d._bindEvtDisplayToolbox}),document.querySelectorAll('[data-action="add-component"]').forEach(function(t,e){t.onclick=d._bindEvtAddComponent}),document.querySelectorAll('[data-action="remove-component"]').forEach(function(t,e){t.onclick=d._bindEvtRemoveComponent}),(t=document.getElementById("canvasContainer").querySelectorAll(".canvas-content-block")).length>0&&t.forEach(function(t,e){if("empty"!==t.getAttribute("data-content")){var n=t.getAttribute("id"),o=t.querySelector(".canvas-content-snippet").getAttribute("data-component-type");d.handleEditEventsToDOM(n,o)}}),document.addEventListener("click",function(t){null===function(t,e){for(Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(t){for(var e=(this.document||this.ownerDocument).querySelectorAll(t),n=e.length;--n>=0&&e.item(n)!==this;);return n>-1});t&&t!==document;t=t.parentNode)if(t.matches(e))return t;return null}(t.target,".canvas-add-component")&&toolbox.classList.remove("in")},!1),d.togglePageButtons()}})},_bindEvtDisplayToolbox:function(){var t=document.getElementById("toolbox");t.classList.remove("in"),t.style.display="block",this.parentElement.appendChild(t);var e=t.offsetWidth,n=this.parentElement.classList.contains("canvas-add-subcontent");t.style.left=n?"0":"calc(50% - "+(e/2+4)+"px)",t.classList.contains("in")?t.classList.remove("in"):t.classList.add("in"),t.focus()},_bindEvtAddComponent:function(){var t=Math.random().toString(36).replace(/[^a-z]+/g,"").substr(2,10),e=this.getAttribute("data-ui-label"),n={};l.a.render("content",{id:t,type:e,data:i.a.elems[e],trigger:this,callback:function(o){d.handleEditEventsToDOM(t,e),o.forEach(function(t,e){t.onclick=d._bindEvtDisplayToolbox}),document.querySelector('[data-action="remove-component"][data-target="'+t+'"]').onclick=d._bindEvtRemoveComponent,n.id=t,n.type=e,d.existing_data.push(n)}}),l.a.render("canvas",{data:d.existing_data,dependencies:[],trigger:"user"}),d.togglePageButtons()},_bindEvtSelectionDropdown:function(){var t=this.value,e=this.getAttribute("data-target"),n=document.getElementById(e).firstElementChild;n.className="blockquote",n.classList.add("blockquote-"+t)},_bindEvtHeaderInput:function(){""==this.textContent&&(this.textContent="Click here to edit heading")},_bindEvtRemoveComponent:function(){for(var t=this.getAttribute("data-target"),e=(this.getAttribute("data-target-type"),document.getElementById("canvasContainer")),n=document.getElementById(t),o=0;o<=d.existing_data.length-1;o++)if(d.existing_data[o].id===t){d.existing_data.splice(o,1);break}var a=document.getElementById("toolbox");a.classList.remove("in"),a.style.display="block",e.appendChild(a),n.remove()},togglePageButtons:function(){d.btnPreview.style.display=0==d.existing_data.length?"none":"initial",d.btnSave.style.display=0==d.existing_data.length?"none":"initial"},handleEditEventsToDOM:function(t,e){var n=document.getElementById("snippet-"+t),o=i.a.elems[e].contentEditorBindToElem,a=function(t,e,n){var o=document.querySelector("#snippet-"+t+" ."+e),a=document.querySelector("#snippet-"+t+" ."+n);o.contentEditable=!0,a.contentEditable=!0,o.onblur=d._bindEvtHeaderInput,a.id="contentEditableBody-"+t};("blockQuotes"==e&&(a(t,"blockquote-content-header","blockquote-content-body",d._bindEvtHeaderInput),document.querySelector('[data-target="snippet-'+t+'"]').onchange=d._bindEvtSelectionDropdown),"wellContainer"==e&&a(t,"well-heading","well-body",d._bindEvtHeaderInput),"genericTabs"==e)&&n.querySelectorAll(".tab-content").forEach(function(t,e){var n=t.getAttribute("id");d.init_sortable({container:document.getElementById(n),contentDraggableClass:".canvasDraggableSub_"+n})});if("styledLists"!=e&&"textEditor"!=e||(n.contentEditable=!0),"none"!==o){var c="content"==o?"contentEditableBody-"+t:"snippet-"+t;d.init_ckeditor({container:c,value:i.a.elems[e].template(),config:i.a.elems[e].contentEditorConfig})}},init_sortable:function(t){var e={sort:!0,touchStartThreshold:5,filter:'[data-content="empty"]',chosenClass:"canvas-content-chosen",ghostClass:"canvas-content-ghost",dragClass:"canvas-content-dragging",animation:300,easing:"cubic-bezier(1, 0, 0, 1)",handle:t.contentDraggableClass,direction:"vertical",onEnd:d.update_list};new s.a(t.container,e)},init_ckeditor:function(t){var e={selector:"#"+t.container,inline:!0,menubar:!1,default_link_target:"_blank"};e.toolbar=t.config.toolbar,e.plugins=t.config.plugins,tinymce.init(e)},html_view:function(){var t=this.value;d.sourceSection.style.display="source"==t?"block":"none",d.htmlSection.style.display="html"==t?"block":"none"},close_preview:function(){d.outputPane.style.display="none"},generate_html:function(){d.outputPane.style.display="block";var t,e="",n=[],a=function(t,e,n){return"genericTabs"==t?{subnodes:[],html:""}:"wellContainer"==t||"blockQuotes"==t?{html:e,variables:[o(n.querySelector("h5").textContent),o(n.querySelector(".mce-content-body").innerHTML)]}:{html:e}},i=function(t){var e,n=t.cloneNode(!0),o=n.querySelector(".mce-content-body"),a=o.classList[0],i=c(o);return o.remove(),e='<div class="'.concat(a,'">').concat(i,"</div>"),n.lastElementChild.insertAdjacentHTML("beforeend",e),n.outerHTML},c=function(t){if(t.classList.contains("mce-content-body")){var e=t.getAttribute("id");return document.getElementById(e).innerHTML}return t.innerHTML};d.existing_data.length>0&&document.querySelectorAll("#canvasContainer > .canvas-content-block").forEach(function(t,l){var r=t.querySelector(".canvas-content-snippet"),s=r.getAttribute("data-component-type"),d=t.getAttribute("id"),u=r.firstElementChild,b={},p=function(t,e,n){return{type:t,id:e,metadata:n}};if(u.classList.contains("tabs")){var m='<div class="tabs">';m+=r.firstElementChild.firstElementChild.innerHTML,b=a(s,u),n.push(p(s,d,b)),u.querySelectorAll(".tab-content").forEach(function(t,e){var o="",r=t.querySelectorAll(".canvas-content-block"),s=t.querySelectorAll(".canvas-content-block .canvas-content-snippet"),d=t.getAttribute("id").split("tab-")[1],u=document.querySelector('.tab-item-link[data-target="tab-'+d+'"]').textContent;n[l].metadata.subnodes.push({label:u,id:d,content:[]}),s.forEach(function(t,s){var d=t.firstElementChild,u=t.getAttribute("data-component-type"),b=r[s].getAttribute("id"),m=d.classList.contains("blockquote")||d.classList.contains("well")?i(d):c(t),g=a(u,m,d);n[l].metadata.subnodes[e].content.push(p(u,b,g)),o+=m}),m+='<section class="'.concat(t.className,'" id="').concat(t.id,'">').concat(o,"</section>")}),n[l].metadata.html=m,e+=m+"</div>"}else{var g;if(u.classList.contains("blockquote")||u.classList.contains("well")){o(u.querySelector("h5").textContent),o(u.querySelector(".mce-content-body").innerHTML);g=o(i(u)),b=a(s,g,u),e+=g}else g=o(c(r)),b=a(s,g),e+=g;n.push(p(s,d,b))}}),t=n.length>0?'<pre style="display: none; position: absolute;">'.concat(JSON.stringify(n).replace(/</g,"&lt;").replace(/>/g,"&gt;"),"</pre>"):"",d.htmlSection.innerHTML=d.existing_data.length>0?e:"<strong>Nothing to display here.</strong>",d.sourceSection.value=d.htmlSection.innerHTML,d.html_data_json=t,document.querySelectorAll('#outputContainer *[contenteditable="true"]').forEach(function(t,e){t.removeAttribute("contenteditable")}),console.log(d.html_data_json),console.log(n)},save_html:function(){d.generate_html(),d.outputPane.style.display="none";var t={method:"insertToContentEditor",origin:window.location.origin,crxid:d.crxID,data:{html:d.sourceSection.value+d.html_data_json,ckeditorIntanceId:this.getAttribute("data-target")}};try{window.chrome.runtime.sendMessage(d.crxID,t)}catch(t){console.log("Attempting to do a chrome api method. Page origin is not via chrome extension")}},run:function(){this.init()}};d.run()},9:function(t,e){t.exports={canvasContainer:document.getElementById("canvasContainer"),render:function(t,e){this[t](e)},toolbox:function(t){var e='<div class="toolbox" id="toolbox"><ul class="toolbox-toolbar" id="toolbar" tabIndex="-1">';for(key in t)e+='<li class="toolbar-item" data-action="add-component" data-ui-label="'.concat(key,'">\n\t\t\t\t<small>').concat(t[key].ui_label,"</small>\n\t\t\t</li>");this.canvasContainer.insertAdjacentHTML("beforeend",e+"</ul></div>")},canvas:function(e){var n=e.data.length,o=e.data,a=e.trigger,i=e.dependencies[0],c=e.dependencies[1];if("auto"==a){var l;l=n>0?function(){var e="";try{for(var n=0;n<=o.length-1;n++){var a,l=o[n].id,r=o[n].type,s=o[n].metadata,d=void 0;if(a={id:l,type:r,data:i.elems[r]},s.hasOwnProperty("subnodes")&&s.subnodes.length>0){d=i.elems[r].template({subnodes:s.subnodes});for(var u=t.exports.renderContentBlock(a,d,void 0),b=0;b<=s.subnodes.length-1;b++){var p=s.subnodes[b],m="";if(p.content.length>0)for(var g=0;g<=p.content.length-1;g++){var v={type:p.content[g].type,id:p.content[g].id,data:i.elems[p.content[g].type]},h=i.elems[p.content[g].type].template();m+=t.exports.renderContentBlock(v,h,p.id)}u=c(u,"{{ tab-"+p.id+" }}",m)}e+=u}else d=s.html,e+=t.exports.renderContentBlock(a,d,void 0)}}catch(t){console.log(t),console.log("ContentBlocks module is missing")}return e}():'\n      <section class="canvas-content-block" data-content="empty"> \n        <img src="images/empty-icon.svg" alt="Empty">\n        <h4 class="empty-text">There\'s nothing in here.<br><small>Start building your content.</small></h4>\n        <div class="canvas-add-component">\n          <button type="button" class="canvas-btn canvas-btn-primary" data-action="select-component">\n            Add Content Block\n          </button>\n        </div>\n      </section>',this.canvasContainer.innerHTML=l,e.callback()}if("user"==a&&1==n){var r=document.querySelectorAll('[data-content="empty"]'),s=document.getElementById("toolbox");s.parentNode.removeChild(s),this.canvasContainer.removeChild(r[0]),this.canvasContainer.appendChild(s)}},content:function(e){var n,o,a=e.trigger.closest(".canvas-content-block"),i=a.getAttribute("data-content"),c=document.getElementById("toolbox").previousElementSibling.classList.contains("forTabs"),l=e.data.template();if("empty"===i)n=t.exports.renderContentBlock(e,l,void 0),this.canvasContainer.insertAdjacentHTML("beforeend",n);else if(c){var r=a.querySelector(".tab-content.in").getAttribute("id");n=t.exports.renderContentBlock(e,l,r);var s=a.querySelector(".tab-content.in");s.getAttribute("id");0==s.childNodes.length?s.innerHTML=n:s.insertAdjacentHTML("beforeend",n)}else n=t.exports.renderContentBlock(e,l,void 0),a.insertAdjacentHTML("afterend",n);o=document.querySelectorAll("#"+e.id+' .canvas-add-component [data-action="select-component"]'),e.callback(o)},renderContentBlock:function(e,n,o){return'\n    <section class="canvas-content-block" id="'.concat(e.id,'">\n      <div class="canvas-content-config"> \n        <span class="canvas-content-draggable \n          ').concat(void 0===o?"canvasDraggableMain":"canvasDraggableSub_"+o,'"></span>\n        ').concat(e.data.hasOwnProperty("types")?t.exports.renderOptions(e):"",'\n        <button class="canvas-btn canvas-btn-xs" \n          data-action="remove-component"\n          data-target="').concat(e.id,'" data-target-type="').concat(e.type,'">\n          <i class="icon-delete"></i> Remove\n        </button>\n      </div>\n      <div class="canvas-content-snippet" id="snippet-').concat(e.id,'" data-component-type="').concat(e.type,'">\n        ').concat(n,"\n      </div>\n      ").concat(e.data.hasChildContent?t.exports.renderAddSubContent():"","\n      ").concat(void 0===o?t.exports.renderAddMainContent():"","\n    </section>")},renderOptions:function(t){for(var e="",n=0;n<=t.data.types.length-1;n++)e+='<option value="'.concat(t.data.types[n].ui_value,'">').concat(t.data.types[n].ui_label,"</option>");return'<select class="canvas-form-control" name="s-'.concat(t.id,'" data-target="snippet-').concat(t.id,'">').concat(e,"</select>")},renderAddSubContent:function(){return'\n    <div class="canvas-add-component canvas-add-subcontent">\n      <button type="button" class="canvas-btn canvas-btn-xs btn-has-text forTabs" data-action="select-component">\n        <i class="icon-plus">&#43;</i> Add Content to this tab\n      </button>\n    </div>\n    '},renderAddMainContent:function(){return'\n      <div class="canvas-content-action canvas-add-component">\n        <div class="content-action-hotspot">\n          <button type="button" class="canvas-btn canvas-btn-xs" data-action="select-component">\n            <i class="icon-plus">&#43;</i>\n          </button>\n        </div>\n      </div>\n    '},update:function(){}}}});