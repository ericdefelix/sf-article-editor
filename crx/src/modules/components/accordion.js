export class Accordion {
  constructor(id) {
    this.id = id;
  }

  render() {
    return 'test';
  }
}

// "use strict";
// class Tabset {
//   constructor(tabSetId, ...tabNames) {
//     this.tabSetId = tabSetId;
//     this.tabSet = document.getElementById(this.tabSetId);
//     this.tabNames = tabNames;
//     this.tabBoxContents = new Map();
//     this.render();
//   }

//   render() {
//     this.tabMaps = this.tabNames.map((tabName) => (new Map([["name", tabName], ["id", Tabset.guid()]])));
//     var tabElts = this.tabMaps.map((obj) => (`<div class="tab" id="${obj.get("id")}"><span class="tab-span" tabindex="1">${obj.get("name")}</span></div>`));
//     var htmlTabs = `<div class="tabs">
//        ${tabElts.join("\n")}</div>`;
//     this.tabSet.innerHTML = htmlTabs;
//     var htmlTabBoxes = `<div class="tab-boxes">
//           ${this.tabMaps.map((obj) => (`
//           <div class="tab-box" id="${obj.get("id")}-box">
//             ${(this.tabBoxContents.has(obj.get('name'))) ? (this.tabBoxContents.get(obj.get('name'))) : `This is the '${obj.get("name")}' box.`}
//           </div>`)).join("\n")}
//       </div>`;
//     this.tabSet.innerHTML += htmlTabBoxes;
//     this.tabBinds = new Map();
//     this.tabNodes = [];
//     this.tabBoxNodes = [];
//     this.tabMaps.map((obj) => {
//       var id = obj.get("id");
//       var name = obj.get("name");
//       var instance = this;
//       var tabElt = document.getElementById(id);
//       tabElt.firstChild.addEventListener("focus", function (evt) { instance.activeTab = evt.target.textContent });
//       var tabBoxElt = document.getElementById(id + "-box");
//       this.tabNodes.push(tabElt);
//       this.tabBoxNodes.push(tabBoxElt);
//       this.tabBinds.set(name,
//         new Map([
//           ["name", name],
//           ["id", id],
//           ["tabElt", tabElt],
//           ["tabBoxElt", tabBoxElt]
//         ])
//       )
//     });
//   }
// };
