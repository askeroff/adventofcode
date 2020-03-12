(function () {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split('');
  let puzzleData = data.map(item => +item);

  function solvePart1(input) {
    let stop = false;
    const data = [];
    let i = 0;
    while (stop !== true) {
      if (input[i]) {
        const layer = [];
        for (var a = i, z = 0; input[a] !== undefined, z < 6; a += 25, z++) {
          layer.push(input.slice(a, a + 25));
        }
        data.push(layer);
        i = a;
      } else {
        stop = true;
      }
    }
    console.log(data);
    const zeroes = [];
    data.forEach(item => {
      let numberOfZeroes = 0;
      item.flat().forEach(num => {
        if (num === 0) {
          numberOfZeroes += 1;
        }
      });
      zeroes.push(numberOfZeroes);
    });
    let min = Infinity;
    let minIndex = 0;
    zeroes.forEach((zero, index) => {
      if (zero < min) {
        min = zero;
        minIndex = index;
      }
    });
    const twos = data[minIndex].flat().filter(n => n === 2).length;
    const ones = data[minIndex].flat().filter(n => n === 1).length;
    console.log(twos * ones, 'ANSWER TO FIRST PART');
  }

  solvePart1(puzzleData);
})();
