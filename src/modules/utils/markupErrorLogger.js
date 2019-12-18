import HTMLHint from 'HTMLHint';

const config = {
  'tagname-lowercase': true,
  'attr-value-double-quotes': true,
  'tag-pair': true,
  'id-unique': true,
  'src-not-empty': true,
  'attr-no-duplication': true,
  'attr-lowercase': true
};

export default function storeMarkupErrors(ih, type) {
  const ihLint = HTMLHint.verify(ih, config);
  // Debug Log to Local storage
  if (ihLint.length > 0) {
    const localStorageArray = JSON.parse(localStorage.getItem('DebugLog')) || [];
    let messageArr = [...localStorageArray];
    const gmtErrotDate = new Date();

    ihLint.forEach(({ message }) => {
      const isRepeated =
        typeof localStorageArray.find(i => i.message === message) === 'object' ||
        typeof messageArr.find(i => i.message === message) === 'object';

      const newItem = {
        type,
        date: gmtErrotDate.toLocaleString(),
        message: message,
        markup: ih
      };

      if(!isRepeated) {
        messageArr = [
          ...messageArr,
          newItem
        ];
      } else {
        messageArr = [
          ...messageArr,
        ];
      }
    });
    
    localStorage.setItem('DebugLog', JSON.stringify(messageArr));
  }
}
