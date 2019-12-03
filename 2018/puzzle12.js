(function() {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split('\n');

  function checkRule(string, rules) {
    const find = rules.find(item => item.substr(0, 5) === string);
    if (find) {
      return find[find.length - 1];
    }
    return '.';
  }

  function makeGeneration(data, rules) {
    const offset = ['.', '.', '.', '.', '.'];
    // ['.', '.', '.', '.', '#', '.', '#',]
    const arr = [...offset, ...data, ...offset];
    const result = arr.map((item, index) => {
      if (index >= 2 && index <= arr.length - 3) {
        const current = `${arr[index - 2]}${arr[index - 1]}${item}${
          arr[index + 1]
        }${arr[index + 2]}`;
        let x = checkRule(current, rules);
        return x;
      }
      return item;
    });
    return result;
  }

  function calculateSum(generation, firstIndex) {
    let sum = 0;
    generation.forEach((item, index) => {
      if (index < firstIndex && item === '#') {
        sum -= firstIndex - index;
      } else if (index > firstIndex && item === '#') {
        sum += index - firstIndex;
      }
    });
    return sum;
  }

  function findAnswer(data) {
    const initialState = data
      .shift()
      .split('initial state: ')[1]
      .split('');
    const rules = data.slice(1);
    rules.pop();
    let firstIndex = 0;
    let generation = [];
    for (let i = 1; i <= 20; i++) {
      if (i === 1) {
        generation = makeGeneration(initialState, rules);
      } else {
        generation = makeGeneration(generation, rules);
      }
      firstIndex += 5;
    }
    // last guess  250000000224
    let newSum = calculateSum(generation, firstIndex);
    // first answer above

    // second part loop enough to see repeating patterns
    // then do the math basically...
  }

  const answer = findAnswer(data);
})();

