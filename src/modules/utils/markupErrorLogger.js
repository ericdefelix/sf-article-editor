import HTMLHint from 'HTMLHint';

const config = {
    "tagname-lowercase": true,
    "attr-value-double-quotes": true,
    "tag-pair": true,
    "id-unique": true,
    "src-not-empty": true,
    "attr-no-duplication": true,
    "attr-lowercase": true
  };

export default function storeMarkupErrors(ih, type){
    const ihLint = HTMLHint.verify( ih, config);
    // Debug Log to Local storage
    if (ihLint.length > 0) {
      let messageArr = [];
      const gmtErrotDate = new Date();

    
    
      ihLint.forEach(({message}) => {
        const localStorageArray = JSON.parse(localStorage.getItem('DebugLog')) || [];
        messageArr = [
          ...messageArr,
          ...localStorageArray,
          {
            type,
            date: gmtErrotDate.toLocaleString(),
            message: message,
            markup: ih
          }
        ];
      });
      localStorage.setItem(
        'DebugLog',
        JSON.stringify(messageArr));
    }
      
}
