(function() {
  const pre = document.getElementsByTagName('pre')[0];
  const data = pre.innerHTML.toString().split('\n');
  data.pop();
  function part1(arr) {
    let result = 0;

    arr.forEach(item => {
      let calc = Math.floor(item / 3) - 2;
      result += calc;
    });
    console.log(result);
    return result;
  }

  function calcFuel(num) {
    let calc = Math.floor(num / 3) - 2;
    if (calc <= 0) {
      return 0;
    }
    return calc;
  }
  let fuel = part1(data);

  function part2(num) {
    let result = 0;
    let lastValue = num;
    while (lastValue > 0) {
      lastValue = calcFuel(lastValue);
      console.log(lastValue, 'here');
      result += lastValue;
    }
    return result;
  }
  function solveForPart2() {
    let result = 0;
    data.forEach(item => {
      let calculated = part2(+item);
      result += calculated;
    });
    return result;
  }
  solveForPart2();
})();
// 1611657
