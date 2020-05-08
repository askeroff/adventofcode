(function () {
  let data = document.getElementsByTagName('pre')[0].innerHTML.split('');
  data.pop();
  let puzzleData = data.map(item => +item);
  let testData = '0222112222120000'.split('').map(item => +item);

  let layers = [];

  const w = 2;
  const h = 2;

  function solvePart1(input) {
    let stop = false;
    const data = [];
    let i = 0;
    while (stop !== true) {
      if (input[i] !== undefined) {
        const layer = [];
        for (var a = i, z = 0; input[a] !== undefined, z < h; a += w, z++) {
          layer.push(input.slice(a, a + w));
        }
        data.push(layer);
        i = a;
      } else {
        stop = true;
      }
    }
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
    layers = data;
  }

  solvePart1(testData);

  // solvePart1(puzzleData);


  function solvePart2() {
    const answer = [];
    console.log(layers, 'layers');
    for (let z = 0; z < h; z++) {
      let arr = [];
      for (let i = 0; i < w; i++) {
        layers.forEach((layer) => {
          if (layer[z][i] !== 2 && arr[i] !== 0) {
            arr[i] = layer[z][i];
          } else if (arr[i] === undefined) {
            arr[i] = '_';
          }
        });
      }

      answer.push(arr);
    }

    console.log(answer, 'second answer');
  }

  solvePart2();

})();
