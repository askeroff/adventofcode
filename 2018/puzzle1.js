// first part just map the array and reduce the values to single sum
const pre = document.getElementsByTagName('pre')[0];
const data = pre.innerHTML.toString().split('\n');
data.pop();
// second part of the puzzle
function getAnswer(data) {
  const freq = [];
  let answer;
  let i = 0;

  const numbers = data.map(item => Number(item));
  function reduceMe(initialValue = 0, firstTime = true) {
    let result;
    let arr = firstTime ? numbers.slice(1) : numbers;
    arr.reduce((accum, current, index) => {
      result = Number(accum) + Number(current);
      if (freq.indexOf(Number(result)) !== -1 && answer === undefined) {
        answer = Number(result);
      }
      if (answer === undefined) {
        freq.push(Number(result));
      }
      return result;
    }, initialValue);
    if (answer === undefined) {
      reduceMe(result, false);
    }
  }
  reduceMe(Number(data[0]), true);
  return answer;
}
// takes about 15 seconds on my machine
// not the best solution obviously
let a = getAnswer(data);

