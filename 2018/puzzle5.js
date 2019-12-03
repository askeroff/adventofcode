(function() {
  // ! Takes too much time
  let data = document.getElementsByTagName('pre')[0].innerHTML;
  data = data.substring(0, data.length - 1);
  // const data = 'dabAcCaCBAcCcaDA';
  function genCharArray(charA, charZ) {
    var a = [],
      i = charA.charCodeAt(0),
      j = charZ.charCodeAt(0);
    for (; i <= j; ++i) {
      a.push(String.fromCharCode(i));
    }
    return a;
  }
  const alphabet = genCharArray('a', 'z'); // ["a", ..., "z"]

  const myString = data;

  function getUnits(str) {
    let has = false;
    let result = str;
    let arr = str.split('');
    let i = 0;
    while (i < arr.length) {
      const first = arr[i];
      const second = arr[i + 1] || '';
      const notSame = first !== second;
      if (first.toUpperCase() === second.toUpperCase() && notSame) {
        result = result.substr(0, i) + result.substr(i + 2);
        arr = result.split('');
        i = -1;
      }

      i++;
    }
    return result;
  }
  let min = Infinity;
  for (let i = 0; i < alphabet.length; i++) {
    const testString = data
      .split('')
      .filter(item => item.toUpperCase() !== alphabet[i].toUpperCase())
      .join('');
    let res = getUnits(testString);
    if (res.length < min) {
      min = res.length;
    }
  }
  // const answer = getUnits(myString);
  console.log(min);
})();
