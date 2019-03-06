export default class ContentEditor{
  constructor(id){
    this._id = id;
    this._content = '';
  }

  set val(content){
    this._content = content;
  }
  
  get val() {
   return this._content;
  }

  inject(string) {
    this._content += string;
  }
};