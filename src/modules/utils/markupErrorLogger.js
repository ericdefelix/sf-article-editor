import HTMLHint from 'htmlhint/dist/htmlhint';
// export default function storeMarkupErrors(ih, type) {
export default function storeMarkupErrors(ih) {
  const config = {
    'tagname-lowercase': true,
    'attr-value-double-quotes': true,
    'tag-pair': true,
    'id-unique': true,
    'src-not-empty': true,
    'attr-no-duplication': true,
    'attr-lowercase': true
  };
  const header =
    '<ol class="sf-list-bullet-circular"><li><div class="sf-well"><h5 class="sf-well-heading">Click to edit heading</h5>';
  const ihLint = HTMLHint.verify(header, config);
  console.log(ihLint);
  
  // Debug Log to Local storage
  // if (ihLint.length > 0) {
  //   const localStorageArray = JSON.parse(localStorage.getItem('DebugLog')) || [];
  //   let messageArr = [...localStorageArray];
  //   const gmtErrotDate = new Date();

  //   ihLint.forEach(({ message }) => {
  //     const isRepeated =
  //       typeof localStorageArray.find(i => i.message === message) === 'object' ||
  //       typeof messageArr.find(i => i.message === message) === 'object';

  //     const newItem = {
  //       // type,
  //       date: gmtErrotDate.toLocaleString(),
  //       message: message,
  //       markup: ih
  //     };

  //     if(!isRepeated) {
  //       messageArr = [
  //         ...messageArr,
  //         newItem
  //       ];
  //     } else {
  //       messageArr = [
  //         ...messageArr,
  //       ];
  //     }
  //   });
    
  //   localStorage.setItem('DebugLog', JSON.stringify(messageArr));
  // }
}
