export function ImgGallery() {
  Object.defineProperty(arr, "push", {
    enumerable: false, // hide from for...in
    configurable: false, // prevent further meddling...
    writable: false, // see above ^
    value: function () {
      for (var i = 0, n = this.length, l = arguments.length; i < l; i++ , n++) {
        RaiseMyEvent(this, n, this[n] = arguments[i]); // assign/raise your event
      }
      return n;
    }
  });
};